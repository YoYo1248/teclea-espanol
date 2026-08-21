# Word data licensing

The application catalog contains 2,200 practice cards: 748 edited base and candidate cards, 48 Spain newcomer task-vocabulary cards checked against official public-service pages, and 1,404 source-traceable A1–B2 expansion cards produced in seventeen review batches. A separate retained research file contains 340 unique conjugated forms but is excluded from the application catalog, as are sentence-length drills.

Frequency ordering for the common-word teaching selection was informed by `wordfreq`:

- wordfreq: https://github.com/rspeer/wordfreq
- Software license: Apache-2.0
- Redistributable word-frequency data: CC BY-SA 4.0
- wordfreq attribution and source list: https://github.com/rspeer/wordfreq/blob/master/CREDITS.md

Spanish lexical forms and conjugations were checked against the Kaikki machine-readable Spanish dictionary, extracted from English Wiktionary with Wiktextract.

- Kaikki Spanish dictionary: https://kaikki.org/dictionary/Spanish/index.html
- English Wiktionary copyright terms: https://en.wiktionary.org/wiki/Wiktionary:Copyrights
- Relevant upstream terms: CC BY-SA 4.0 and GFDL
- Verification date recorded in the data: 2026-08-14

Chinese glosses, example sentences, CEFR labels and scene groupings were created or editorially assigned for HolaDone. A1–C2 topic and communicative-function boundaries were informed by the corresponding Instituto Cervantes Plan Curricular inventories; the 200 B1–B2 cards and 200 C1–C2 candidate cards are original teaching selections rather than official or exhaustive Instituto Cervantes word lists. C1–C2 entries still require qualified language review. Labels remain learning-order suggestions, not official certifications. These modifications and additions do not imply endorsement by wordfreq, Wiktionary, Kaikki, Instituto Cervantes or their contributors.

The application code remains available under GPL-3.0 as stated in `LICENSE`. This notice preserves the attribution and licensing information for the lexical-data portion.

## Lexicon expansion artifacts

The reproducible expansion pipeline records source ids in every candidate row and resolves them through `data/lexicon/sources.json`. Locally generated wordfreq candidate artifacts remain under `artifacts/lexicon/`, which is gitignored. Any redistributed derivative must keep wordfreq attribution and CC BY-SA 4.0 terms with the data; do not detach a converted list from its source manifest.

Instituto Cervantes PCIC content is used only as a framework and mapping reference, not copied wholesale into the catalog. RAE CORPES XXI is used only for query-based or aggregate usage validation until raw-list redistribution terms are confirmed. Kaikki / English Wiktionary verification remains subject to the upstream CC BY-SA 4.0 / GFDL terms and attribution requirements.
