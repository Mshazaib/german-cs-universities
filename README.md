# German Universities Portal

A static, public, read-only portal for Master's programmes in Computer Science, IT, Software Engineering, Data Science, AI/ML, Cybersecurity and closely related computing fields in Germany.

## Project structure

```text
german-universities-portal/
├── index.html
├── vercel.json
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── data/
│   ├── programs.json
│   ├── config.json
│   └── excluded-seed-rows.json
└── docs/
    ├── DATA_SCHEMA.md
    └── RESEARCH_NOTES.md
```

## Important design choice

This is intentionally **read-only**. There are no public controls for:

- adding programmes
- editing programmes
- deleting programmes
- downloading/exporting the programme list
- tracking an applicant's "Applied" status

The public interface only supports search, filter, sort, programme details and source links.

## How to edit the programme list later

Edit only `data/programs.json` for normal data maintenance. Each programme is a separate JSON object. Keep the following fields current:

- `university`
- `program`
- `field`
- `language`
- `intakes`
- `admissionType`
- `applicationRoute`
- `vpd`
- `moi`
- `ielts`
- `gre`
- `deadlines`
- `tuition`
- `semesterFee`
- `applicationFee`
- `sourceStatus`
- `sourceChecked`
- `sources`
- `notes`

Use `sourceStatus: "Verified from ..."` only after checking DAAD or an official university source. Otherwise use `Needs current-source re-check`.

## Updating title, contact or disclaimer

Edit `data/config.json`. The footer currently shows:

**Data source provided by Muhammad Shazaib**  
**Contact: 03120416882**

and the public disclaimer:

> Errors are possible. Verify every detail at daad.de and the official university website before applying.

## Deploy on Vercel

1. Upload the whole `german-universities-portal` folder to a GitHub repository.
2. In Vercel, create a new project from that repository.
3. Framework preset: **Other** / static site.
4. Build command: leave empty.
5. Output directory: leave empty / repository root.
6. Deploy.

No database, Node build step or server is required.

## Local preview

Do not rely on double-clicking `index.html`, because browsers can block local JSON `fetch()` calls. From the project folder, run any simple static server, for example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Data provenance

The supplied Excel file was used as the seed list. The portal dataset was narrowed to the requested computing scope, obvious duplicates/out-of-scope programmes were removed, and additional programmes were researched from DAAD and official university sources. MyGermanUniversity was used as a secondary discovery/cross-check source where its indexed information was available; DAAD and official university pages are treated as the authoritative verification targets.

Because German universities can change deadlines, admission rules, English proof requirements, fees and application routes between intakes, the database must be maintained continuously.
