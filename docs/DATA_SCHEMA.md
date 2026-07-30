# Data schema

`data/programs.json` contains a `meta` object and a `programs` array.

## Programme object

```json
{
  "id": "unique-slug",
  "university": "University name",
  "program": "Programme name",
  "degree": "M.Sc.",
  "field": "AI / Machine Learning",
  "language": "English",
  "intakes": ["Summer", "Winter"],
  "admissionType": "Selection / aptitude",
  "applicationRoute": "VPD + university portal",
  "vpd": "Yes",
  "moi": "Check accepted proof list",
  "ielts": "6.5",
  "gre": "Not stated",
  "deadlines": {
    "summer": "01 Nov–15 Jan",
    "winter": "01 Apr–15 Jul",
    "note": "Applicant-group-specific notes"
  },
  "tuition": "€0 tuition",
  "semesterFee": "Semester contribution applies",
  "applicationFee": "Not stated",
  "sourceStatus": "Verified from DAAD",
  "sourceChecked": "2026-07-29",
  "sources": [
    {"label": "DAAD programme page", "url": "https://..."}
  ],
  "notes": "Any programme-specific warning or context.",
  "seedRow": 14
}
```

## Recommended maintenance rules

1. Never remove the source URL when updating a programme.
2. Update `sourceChecked` each time you re-verify a row.
3. If a deadline cannot be confirmed, write `Check source` rather than guessing.
4. If EU and non-EU deadlines differ, put both in the relevant deadline text.
5. Keep tuition separate from semester contribution/service fees.
6. Do not treat "English-taught Bachelor's" or MOI as automatically accepted unless the university explicitly states it.
7. Use official university rules over third-party summaries if the two conflict.
