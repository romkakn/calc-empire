# Unit Specs — Index

Specs translate outperform briefs into build-ready plans (formulas, inputs, outputs, sources, TODO_VERIFY items). A future session resumes by reading the spec + brief and running the per-unit workflow (`ref:per-unit-workflow` in memory MCP).

| Slug | Brief | Spec | Status |
|---|---|---|---|
| mortgage-recast-calculator | [brief](../recon/outperform-brief-mortgage-recast-calculator.md) | — built | live |
| no-vig-calculator | [brief](../recon/outperform-brief-no-vig-calculator.md) | — built | live |
| dividend-calculator | [brief](../recon/outperform-brief-dividend-calculator.md) | — built | live |
| variance-calculator | [brief](../recon/outperform-brief-variance-calculator.md) | [spec](variance-calculator.md) | planned |
| asphalt-calculator | [brief](../recon/outperform-brief-asphalt-calculator.md) | [spec](asphalt-calculator.md) | planned |
| mixed-number-calculator | [brief](../recon/outperform-brief-mixed-number-calculator.md) | [spec](mixed-number-calculator.md) | planned |
| paycheck-calculator + 50 states | [brief](../recon/outperform-brief-paycheck-calculator.md) | [spec](paycheck-calculator.md) | planned |
| a1c-calculator | [brief](../recon/outperform-brief-a1c-calculator.md) | [spec](a1c-calculator.md) | planned |
| crcl-calculator | [brief](../recon/outperform-brief-crcl-calculator.md) | [spec](crcl-calculator.md) | planned |
| options-profit-calculator | [brief](../recon/outperform-brief-options-profit-calculator.md) | [spec](options-profit-calculator.md) | planned |
| chronological-age-calculator | [brief](../recon/outperform-brief-chronological-age-calculator.md) | [spec](chronological-age-calculator.md) | planned |
| best-free-ai-video-generator-2026 | [brief](../recon/outperform-brief-best-free-ai-video-generator-2026.md) | [spec](best-free-ai-video-generator-2026.md) | planned |
| best-ai-humanizer | [brief](../recon/outperform-brief-best-ai-humanizer.md) | [spec](best-ai-humanizer.md) | planned |

## How to resume

In a new Claude Code session (with github/notion/gmail MCPs installed):

1. `cd ~/projects/calc-empire`
2. `/seo-calc-empire calc-empire build`
3. The skill will iterate planned slugs, read each spec + brief, follow `ref:per-unit-workflow` from memory MCP, open a PR per slug, email Roma.

Or pick a single slug manually:

> "Build the variance-calculator using docs/specs/variance-calculator.md and the outperform brief."
