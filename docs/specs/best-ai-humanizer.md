# Spec — best-ai-humanizer (review article)

**Brief:** [outperform-brief-best-ai-humanizer](../recon/outperform-brief-best-ai-humanizer.md)
**KW / KD / Vol:** best ai humanizer · 8 · 7,300
**Tier:** content
**Category:** articles

## Format

Comparison review article. Article + BreadcrumbList + FAQPage + Person schemas.
No SoftwareApplication.

## Word count + structure target

- 3,000 words (per brief)
- 10+ FAQs
- Apply `humanizer` skill final-pass (it's literally the topic — eat our own dog food)
- Apply `brand-voice:enforce-voice` skill before commit

## Methodology

- Run each humanizer on the same 5 source paragraphs (one technical, one casual,
  one academic, one marketing, one short blog) — see `docs/methodology/humanizer-corpus.md` (TODO)
- Score on three axes: AI-detector evasion (Originality, GPTZero, Turnitin),
  readability preservation, style fidelity

## Content blocks

1. Hero — "We tested 12 AI humanizers on 5 corpora. Here's what actually fools detectors."
2. Methodology + scoring rubric
3. Comparison table (12 tools × 6 columns)
4. Tier breakdown: "Best overall", "Best free", "Best for academic", "Best for SEO", "Don't use"
5. How AI detection works (250 words, neutral, link to MIT / GPTZero blog)
6. Will humanized text get flagged for plagiarism? (separate from AI detection)
7. Ethics + university / publisher policies (link to Nature, Elsevier statements)
8. FAQ ≥ 10
9. References

## Tools to include

Original.AI, StealthGPT, Undetectable.ai, Humbot, Phrasly, BypassGPT,
WriteHuman, AI Humanize, Humanize AI Text, Hix Bypass, Wordfixer Bypass,
Aithor — pin actual list at build (some die monthly)

## TODO_VERIFY

- Each tool's accuracy claim — replicate independently, don't trust the marketing
- Detector dataset is current — re-test on a recent GPT-4-class output
- Pricing page snapshots (vendors change often)
- Ethics section is consistent with current academic-integrity guidance (Nature, COPE)
