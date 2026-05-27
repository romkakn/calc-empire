# Spec — chronological-age-calculator

**Brief:** [outperform-brief-chronological-age-calculator](../recon/outperform-brief-chronological-age-calculator.md)
**KW / KD / Vol:** chronological age calculator · 7 · 33,000
**Tier:** A
**Category:** health (sub: education/assessment use cases)

## Behavior

Compute exact age (years / months / days) between a birth date and a reference
date (default today). Used by speech-language pathologists, school psychologists,
and parents for developmental milestones.

## Inputs

- Date of birth (date input, required)
- Reference / test date (date input, default today)
- Output format toggle: detailed (Y/M/D) vs. decimal years vs. months-only
- Toggle: include adjusted age for prematurity (input weeks early; subtract from chronological)

## Algorithm

- Use JS Date math; account for leap years and varying month lengths
- Decimal years = total days / 365.25
- For Y/M/D format: subtract years first, then months, then days, borrowing as needed (no naive division)

## Outputs (aria-live)

- Y/M/D string
- Decimal years (4 places)
- Total days
- Adjusted age (if prematurity entered)
- Optional: zodiac, generation tag (gimmicky but engagement signal — keep as collapsed `<details>`)

## Mandatory notes

- Audience: clinicians, teachers, parents
- WhenToUse: Bayley scales, REEL-4, GFTA, age-of-onset documentation
- CommonMistakes: not subtracting prematurity for infants < 2 years, treating "5;3" as 5.3 instead of 5y 3m
- FAQ from PAA: "how do I calculate my child's age in months", "what is corrected age", "do you count birthday day or next day"

## TODO_VERIFY

- Test against the SLP-standard formula (no off-by-one on partial months)
- Confirm corrected-age guidance per AAP: subtract weeks early until age 2
