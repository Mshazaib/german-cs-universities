# Research notes — 29 July 2026

## Scope

The public catalogue is limited to Master's programmes in or closely related to:

- Computer Science
- Information Technology / Information Systems
- Software Engineering
- Data Science / NLP
- Artificial Intelligence / Machine Learning
- Cybersecurity / IT Security
- HCI / interactive systems
- Robotics / autonomous systems where the programme is clearly computing-oriented

## Seed cleanup

The supplied spreadsheet contained 70 data rows. The build process removed rows that were clearly outside the requested computing scope and collapsed an obvious duplicate. The excluded rows are documented in `data/excluded-seed-rows.json` rather than silently discarded.


## Current dataset snapshot

As of 29 July 2026, the public JSON contains **94 computing-related Master’s programme records across 64 universities**. Every record has been checked against at least one current DAAD or official-university source during this research pass. Some individual fields still deliberately say “verify” when the current source does not expose a single universal value, when applicant-category deadlines differ, or when an official page shows conflicting dates.

The original spreadsheet was the seed, not the authority. **30 additional computing-related programmes** were added during the research pass beyond the cleaned seed list.

## Verification approach

Priority order for factual verification:

1. official university/programme page
2. DAAD degree/programme database
3. MyGermanUniversity as a secondary discovery/cross-check source
4. the supplied spreadsheet as a seed only

MyGermanUniversity pages are not always directly crawlable by automated tools. Where direct access was unavailable, indexed references and university pages that explicitly link or reference MyGermanUniversity were used for discovery, followed by DAAD or official university verification.

## Important corrections found during research

Examples of seed fields that required correction or stronger qualification:

- University of Bonn Computer Science: the current official Master's application guidance requires English at CEFR **C1**; the spreadsheet's IELTS 5.5 entry should not be used as the current rule.
- University of Tübingen Machine Learning: IELTS **7.0** is required if using IELTS; an English-taught Bachelor's degree alone is not a blanket substitute according to the official FAQ.
- TU Darmstadt Artificial Intelligence and Machine Learning: IELTS **7.0 / C1**, Summer application **01 Dec–15 Jan**, Winter application **01 Jun–15 Jul**.
- TU Braunschweig Data Science: non-EU deadlines differ substantially from EU deadlines; for winter admission non-EU applicants use the **01 Feb–15 Mar** window.
- TUM Informatics: the programme is usually taught in English, uses an aptitude assessment, commonly requires a VPD for foreign Master's entrance qualifications, and currently charges **€6,000 per semester** to international students from third countries unless an exemption/waiver applies.

## Coverage note

The project is a researched working database, not an admissions authority. No third-party database can guarantee that every computing-related programme in Germany is captured at every moment. Programme launches, closures, language changes and deadline changes happen continuously. The portal therefore exposes source links and a verification status instead of presenting every imported value as certain.
