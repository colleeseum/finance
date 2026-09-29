# Salary projection POC

Status: interaction prototype only. This branch intentionally does not add database tables, repositories, production projection services, or tax calculations.

## Purpose

Validate the proposed salary/employment projection workflow before production implementation.

The prototype is available at `/poc/salary-projection`.

## Behaviours represented

- Latest completed year appears as a read-only historical actual row.
- Current annual salary is a factual/baseline input separate from last year's employment income.
- A default annual raise projects later salaries.
- Projected salary, yearly raise, and bonus/other income can be edited directly in the annual table.
- Edited cells are visibly marked as overrides and retain the distinction between calculated and overridden values.
- Salary overrides become the base for subsequent projected years.
- An override can be reset to the calculated value.
- Planned retirement is a date rather than an age; the retirement year is prorated in the POC and later years show zero employment income.
- The screen presents scenario Save and Save As interactions. They are deliberately browser-only placeholders in this POC.

## Important production boundaries

Historical actuals must not be modified by scenario editing. A production implementation should source them from normalized historical employment/tax evidence.

Scenario persistence must preserve both assumptions and explicit per-year overrides. Retirement date belongs to the scenario, not `Person`. Current salary should be effective-dated factual employment data rather than a permanent property of `Person`.

The production projection service should return values with provenance such as historical actual, calculated, and scenario override. UI code should not become the authoritative calculation engine.

## Open design questions for review

- Which columns should be visible in the first production table beyond salary, raise, bonus/other, retirement and employment income?
- Should RRSP contribution appear on this employment screen or in a broader annual cash-flow projection?
- Should a year-specific raise override affect only that year's transition, as represented here, or support explicit salary-effective-date events within a year?
- How should partial-year salary be calculated in production (calendar-day, pay-period, or explicit employment end-date treatment)?
- What scenario operations are required initially: Save As only, or Clone/Rename/Delete and side-by-side comparison as well?
