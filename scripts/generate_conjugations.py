#!/usr/bin/env python3
"""Generate the bundled conjugation drills from a Kaikki Spanish JSONL dump.

Usage:
  python3 scripts/generate_conjugations.py /path/to/kaikki.org-dictionary-Spanish.jsonl.gz
"""

import gzip
import json
import pathlib
import sys


VERBS = {
    "ser": "是（本质）", "estar": "是 / 在（状态）", "tener": "有",
    "hacer": "做", "ir": "去", "poder": "能够", "querer": "想要",
    "decir": "说", "hablar": "说话", "comer": "吃", "vivir": "生活",
    "venir": "来", "poner": "放", "saber": "知道", "ver": "看见",
    "dar": "给", "salir": "出去", "llegar": "到达", "pasar": "经过 / 发生",
    "deber": "应该",
}

TENSES = {
    "present": ({"indicative", "present"}, {"past", "perfect", "compound"}, "现在时", "A1"),
    "preterite": ({"indicative", "present", "perfect"}, {"compound"}, "简单过去时", "A2"),
    "imperfect": ({"indicative", "past", "imperfect"}, set(), "过去未完成时", "A2"),
}

SUBJECTS = {
    "yo": "我",
    "tú": "你",
    "él, ella, usted": "他 / 她 / 您",
    "nosotros": "我们",
    "vosotros": "你们（西班牙）",
    "ustedes, ellos": "他们 / 诸位",
}

# The current Kaikki snapshot has no expanded form table on the Spanish entry
# for ``estar``. Keep this small, reviewable fallback so the generator fails
# closed for every other verb instead of silently dropping a core paradigm.
ESTAR_FALLBACK = {
    "present": ["estoy", "estás", "está", "estamos", "estáis", "están"],
    "preterite": ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
    "imperfect": ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"],
}


def matches(form, required, forbidden):
    tags = set(form.get("tags", []))
    return required <= tags and not tags & (forbidden | {"vos-form", "archaic"})


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Pass one Kaikki Spanish .jsonl.gz file")
    source = pathlib.Path(sys.argv[1])
    forms_by_verb = {verb: [] for verb in VERBS}
    with gzip.open(source, "rt", encoding="utf-8") as stream:
        for line in stream:
            entry = json.loads(line)
            lemma = entry.get("word")
            if entry.get("lang_code") == "es" and entry.get("pos") == "verb" and lemma in VERBS:
                forms_by_verb[lemma].extend(entry.get("forms", []))

    output = []
    for tense_id, (required, forbidden, tense_zh, level) in TENSES.items():
        for lemma, meaning in VERBS.items():
            found = {}
            for form in forms_by_verb[lemma]:
                raw = (form.get("raw_tags") or [""])[0]
                if raw in SUBJECTS and matches(form, required, forbidden):
                    found.setdefault(raw, form["form"])
            if lemma == "estar" and not found:
                found = dict(zip(SUBJECTS, ESTAR_FALLBACK[tense_id]))
            missing = set(SUBJECTS) - set(found)
            if missing:
                raise RuntimeError(f"{lemma} {tense_id} missing {sorted(missing)}")
            for subject, subject_zh in SUBJECTS.items():
                output.append({
                    "spanish": found[subject],
                    "chinese": f"{lemma}（{meaning}）· {tense_zh} · {subject_zh}",
                    "lemma": lemma,
                    "tense": tense_id,
                    "level": level,
                    "person": subject,
                })

    target = pathlib.Path(__file__).parents[1] / "src/generated/conjugations.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(output)} cards to {target}")


if __name__ == "__main__":
    main()
