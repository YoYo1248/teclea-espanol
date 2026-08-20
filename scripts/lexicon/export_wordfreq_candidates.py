#!/usr/bin/env python3
"""Export attributed Spanish frequency candidates from wordfreq.

The output is a staging artifact, not an app-ready vocabulary list. Every row
keeps a source id that resolves to data/lexicon/sources.json.
"""

from __future__ import annotations

import argparse
import json
import unicodedata
from pathlib import Path

from wordfreq import top_n_list, zipf_frequency


def normalize_target(value: str) -> str:
    return " ".join(unicodedata.normalize("NFC", value).lower().split())


def candidate(rank: int, token: str) -> dict:
    normalized = normalize_target(token)
    return {
        "schemaVersion": 1,
        "candidateId": f"wf-es-{rank:06d}",
        "spanish": token,
        "normalizedTarget": normalized,
        "lemma": None,
        "partOfSpeech": None,
        "kindCandidate": None,
        "frequency": {
            "sourceId": "wordfreq-es-3.1.1",
            "rank": rank,
            "zipf": round(float(zipf_frequency(token, "es")), 4),
        },
        "lexical": {
            "sourceId": "kaikki-es-2026-08-16",
            "status": "unverified",
            "checkedAt": None,
            "entryUrl": None,
        },
        "framework": {
            "sourceId": "pcic-cervantes",
            "levelCandidate": None,
            "categoryCandidate": None,
            "sceneCandidate": None,
            "references": [],
        },
        "editorial": {
            "status": "unreviewed",
            "chinese": None,
            "example": None,
            "exampleChinese": None,
            "reviewedBy": None,
            "reviewedAt": None,
            "notes": [],
        },
        "sourceIds": ["wordfreq-es-3.1.1"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=6000)
    parser.add_argument("--output", default="artifacts/lexicon/wordfreq-es-top-6000.jsonl")
    args = parser.parse_args()
    if args.limit < 1:
        parser.error("--limit must be positive")

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    words = top_n_list("es", args.limit)
    with output.open("w", encoding="utf-8") as handle:
        for rank, token in enumerate(words, start=1):
            handle.write(json.dumps(candidate(rank, token), ensure_ascii=False) + "\n")

    print(json.dumps({"source": "wordfreq-es-3.1.1", "rows": len(words), "output": str(output)}))


if __name__ == "__main__":
    main()
