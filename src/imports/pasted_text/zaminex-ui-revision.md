# ZAMINEX ENTERPRISE UI REVISION SPRINT — v2 (Enhanced)

## Functional Fixes, Workflow Completion & UX Refinements

Continue working on the existing Zaminex Enterprise Real Estate CRM in Figma.

This is **NOT** a redesign. This is a **functional completion and consistency pass**.

Preserve 100% of the existing visual language: design system, layout, colors, typography, neumorphism, glassmorphism, spacing, components, and interaction patterns. If a screen already exists, reuse its exact styling tokens, components, and spacing — do not introduce new visual variants.

---

## 0. CONTEXT YOU MUST USE BEFORE CHANGING ANYTHING

Before making any change, inspect the current Figma file and identify:

- The exact component name/instance for each element mentioned below (e.g. the "Edit" button instance inside the Property List row component).
- The exact frame names for: Property List, Property Details, Edit Property Workspace, Create Property Workspace, Listing List, Listing Creation Wizard, Task List, Follow-Up module.
- The existing Searchable Combobox component (its component key/name) used in the Property module — this is the single source of truth for §6.

If any of these cannot be located, flag it explicitly instead of guessing or inventing a new component.

---

## 1. SCOPE BOUNDARIES — DO NOT TOUCH

Explicitly out of scope, do not modify under any circumstance:

- Dashboard / Home screen
- Login, signup, or authentication flows
- Reports & Analytics module layouts (only data values may update automatically when status changes — see §4)
- Global navigation/sidebar structure
- Any color tokens, typography tokens, or spacing tokens

If a fix seems to require touching one of these, stop and flag it instead of proceeding.

---

## 2. ROLE PERMISSION MATRIX (single source of truth)

Apply this matrix consistently across every module below. Do not redefine permissions locally inside individual sections.

| Feature / Action | Administrator | Advisor |
|---|---|---|
| Edit Property | Full access | Per existing role rules (no change) |
| Create Listing | Full access | Full access |
| Listing Status: Draft → Pending Approval | N/A (advisor-initiated) | Allowed |
| Listing Status: Pending Approval → Published | Allowed | Not allowed |
| Listing Status: Pending Approval → Draft (reject) | Allowed | Not allowed |
| Listing Status: Published → Expired | Allowed (auto or manual) | Not allowed |
| Listing Status: Published/Expired → Inactive | Allowed | Not allowed |
| Task: Create / Edit / Filter | Full access | Per existing role rules |
| Follow-Up: Create | Allowed | Allowed |
| Follow-Up: "Assigned To" field | Editable, assignable to any consultant | Locked, auto-filled with current Advisor, non-editable |

---

## 3. NAVIGATION FLOWS (must match exactly — no alternate paths)

**Property List → Edit**
```
Property List → [Edit button on row] → Edit Property Workspace (prefilled)
```
Never routes to Create Property Workspace. Create and Edit are permanently separate destinations.

**Property List → Create**
```
Property List → [+ New Property] → Create Property Workspace (empty)
```

**Property Details → Create Listing**
```
Property Details (Property X) → [+ Create Listing] → Listing Creation Wizard
  → Section 2 (Property) is pre-filled with Property X, field locked or pre-selected
  → User proceeds directly to remaining steps without re-selecting a property
```

---

## 4. LISTING STATUS — STATE DIAGRAM

Exactly 5 states. No additional states, no removed states.

```
                 [Advisor submits]
   Draft ───────────────────────────► Pending Approval
                                            │
                          ┌─────────────────┼─────────────────┐
                  [Admin approves]                    [Admin rejects]
                          │                                     │
                          ▼                                     ▼
                     Published                                Draft

   Published ──[Admin / auto on expiry date]──► Expired
   Published ──[Admin]──► Inactive
   Expired   ──[Admin]──► Inactive
```

Each state requires: badge, icon, color, short description, and a logged entry in Status History.

Every transition must propagate in the same update cycle to: Tables, Cards, Detail pages, Activity Timeline, Reports, Analytics. No stale cached status anywhere in the product.

---

## 5. DATA DICTIONARY — FORMS THAT MUST BE COMPLETED

### 5.1 Create Listing — required fields

| Field | Type | Required | Validation / Notes |
|---|---|---|---|
| Property (linked) | Searchable Combobox | Yes | Pre-filled if launched from Property Details |
| Listing Title | Text | Yes | Max 120 chars |
| Listing Type | Select (Sale/Rent) | Yes | — |
| Price | Number | Yes | > 0, currency formatted |
| Status | System-managed | Yes | Defaults to Draft, see §4 |
| Description | Rich text | Yes | — |
| Media / Images | File upload | Optional | Existing upload component |
| Assigned Consultant | Searchable Combobox | Yes | Same rules as §2 |
| Publish Date | Date | Conditional | Required when status moves to Published |
| Expiry Date | Date | Optional | Triggers auto-Expired transition |

Workflow stages required end-to-end: Create → Edit → Details → Validation → Review → Confirmation. No placeholder screens in any stage.

### 5.2 Task Creation — required fields (Notes included at creation time, not after)

| Field | Type | Required |
|---|---|---|
| Title | Text | Yes |
| Description | Text area | Yes |
| Task Type | Select | Yes |
| Related Property | Searchable Combobox | Yes |
| Assigned Consultant | Searchable Combobox | Yes |
| Priority | Select | Yes |
| Status | Select | Yes |
| Due Date | Date | Yes |
| Completion Date | Date | Optional, system-filled on completion |
| Notes | Text area | Optional, present at creation |
| Attachments | File upload | Optional |

---

## 6. SEARCHABLE COMBOBOX — SINGLE SPEC (define once, reuse everywhere)

Use the existing Property-module Searchable Combobox component as-is. Do not create a new variant. Required states/behaviors:

- Live/instant search-as-you-type
- Keyboard navigation (arrow keys, enter, escape)
- Highlighted matching substring in results
- Empty state ("no results found")
- Loading state (skeleton or spinner matching existing system)
- Performant with large datasets (virtualized list if already implemented elsewhere)
- Identical visual styling and animation timing across every instance below

Apply this exact component, with no visual deviation, to replace the basic dropdowns at:

- Admin → Property List Filters: Consultants, Districts
- Admin & Advisor → Listing List Filters: Consultants, Properties
- Admin & Advisor → Create Listing → Section 2: Property selector
- Admin & Advisor → Create Follow-Up: Linked Property selector

---

## 7. PAGINATION SPEC (apply identically to Property List and Listing List)

- Page size selector: 10 / 20 / 50 / 100
- Previous / Next
- First / Last
- Current page indicator
- Jump-to-page input
- Total record count
- Sticky footer (stays visible while scrolling table/cards)
- Must remain correct and stable when combined with active Search, Filters, and Sorting
- Filters and search state must persist across page navigation (no reset on page change)

---

## 8. VIEW TOGGLE (Card / List)

Extend the existing Property List Card/List toggle to the Listing List, in both Admin and Advisor portals.

- Same toggle component, same animation
- User's last-selected view persists across sessions (per user, per module)
- No visual divergence from the existing Property module pattern

---

## 9. TASK FILTER — FUNCTIONAL SPEC

Replace the non-functional Filter button in the Admin Task List with:

- Filter by: Status, Priority, Assigned Consultant, Related Property, Due Date (range), Task Type, Completion Status
- Multi-select on applicable fields
- "Clear All" action
- Saved Filters (save current filter combination, reuse later)
- Instant/live result update on filter change, no separate "Apply" step required unless that pattern already exists elsewhere in the product (match existing pattern if one exists)

---

## 10. QA CHECKLIST — VERIFY BEFORE DELIVERING

✔ Edit Property opens Edit Property Workspace, never Create.
✔ Create Listing from Property Details pre-selects the correct property.
✔ Property List pagination matches §7 exactly, including sticky footer.
✔ Listing List pagination matches §7 exactly.
✔ Listing List has Card/List toggle with persistence.
✔ Listing status has exactly 5 states matching the §4 diagram, with full propagation.
✔ Task Filter matches §9, fully functional.
✔ Notes field exists at Task creation time, not only after.
✔ Advisors can create Follow-Ups; "Assigned To" follows §2 matrix exactly.
✔ Every selector listed in §6 uses the single Searchable Combobox spec, with zero visual variation between instances.
✔ No placeholder buttons, no dead-end interactions, no incomplete CRUD anywhere touched by this sprint.
✔ Nothing in §1 (out-of-scope list) was modified.

If any check fails, fix it before presenting the result — do not deliver partial completion silently.

---

## 11. FINAL REMINDER

Do not redesign. Do not introduce new colors, fonts, spacing values, or component variants. Every fix must reuse existing design tokens and components. The final result must be visually indistinguishable from the current Zaminex style while being fully functional, internally consistent, scalable, and ready for frontend handoff.

If the scope of this sprint is too large to execute reliably in one pass, split execution into phases in this order and confirm completion of each phase before proceeding to the next:

1. Property module (Edit fix, Create Listing entry point, pagination, view toggle)
2. Listing module (creation workspace, status system, pagination)
3. Task module (filters, creation form)
4. Follow-Up module (permissions, combobox)
5. Global Searchable Combobox rollout (§6) as a final consistency pass across all modules