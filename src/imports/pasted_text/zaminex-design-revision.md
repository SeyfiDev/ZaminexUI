# ZAMINEX ENTERPRISE DESIGN REVISION SPRINT

## Listings • Tasks • Pagination • CRUD Completion

You are continuing the existing Zaminex Enterprise Real Estate CRM project.

This is NOT a redesign.

Do NOT change the established visual language, layout system, spacing, colors, typography, neumorphism, glassmorphism, or component library.

Instead, improve the product by completing missing enterprise workflows and eliminating incomplete UX patterns.

Every change must remain visually identical to the current premium design system while making the product production-ready.

---

# GENERAL RULE

Before implementing any change:

• Analyze affected modules.

• Analyze Administrator permissions.

• Analyze Consultant permissions.

• Analyze related CRUD operations.

• Analyze affected tables.

• Analyze affected forms.

• Analyze filters.

• Analyze search.

• Analyze responsive layouts.

• Automatically propagate every change throughout the entire product.

Never update only one screen.

Every business rule must remain consistent everywhere.

---

# PROPERTY LIST MODULE

The current Property List does not properly support large datasets.

Redesign the Property List as an enterprise-grade data management workspace.

Implement a production-ready pagination system.

Requirements:

• Configurable page size (10, 20, 50, 100)

• Previous / Next navigation

• First / Last page controls

• Current page indicator

• Jump to page

• Total property count

• Sticky pagination footer

• Responsive behavior

• Preserve active filters while navigating pages

The value "10 items per page" is only an example.

The page size must always be configurable.

Pagination must integrate naturally with search, sorting and filters.

---

# COMPLETE PROPERTY CRUD

The current prototype cannot be fully validated because it is not yet possible to create Properties, Consultants, Listings or Tasks.

Replace every placeholder action with complete production-ready workflows.

Generate every missing:

Create Screen

Edit Screen

View Details

Delete Confirmation

Archive Workflow

Restore Workflow

Validation

Success States

Error States

Never leave non-functional buttons inside the UI.

Every primary action must have a complete interface behind it.

---

# LISTING CREATION WORKSPACE

Completely finish the Listing Creation experience.

The Listing module must exist inside BOTH:

Administrator Portal

Consultant Portal

Both portals should share the same design language while respecting role permissions.

Synchronize the entire workflow with the business requirements defined in Task #12 and Task #13.

Generate a complete multi-step Listing Creation Wizard including:

• Basic Information

• Related Property Selection

• Publication Information

• Pricing

• Publication Options

• Review

• Final Confirmation

Every step should contain realistic enterprise form components.

No placeholder content.

No missing fields.

---

# LISTING MANAGEMENT

The Listing List must support enterprise-scale operations.

Implement:

• Search

• Multi-column sorting

• Advanced filtering

• Bulk actions

• Responsive table

• Empty states

• Skeleton loading

• Sticky header

• Sticky pagination

• Saved filters

Pagination requirements:

• Configurable page size

• Total listings count

• Previous / Next

• First / Last

• Jump to page

• Preserve active filters

---

# LISTING STATUS SYSTEM

Replace the current status workflow.

The Listing lifecycle must contain exactly five business states:

Draft

Pending Approval

Published

Expired

Inactive

Each status must include:

• Color badge

• Icon

• Description

• Editable transition

• Status history

Administrators can change any listing status.

Consultants can edit listing information according to their permissions, while status transitions must follow the organization's approval workflow.

Every status change must automatically update:

• Tables

• Cards

• Detail pages

• Timeline

• Activity log

• Reports

• Analytics

---

# TASK CREATION WORKSPACE

Extend the Task Creation experience.

The "Notes" field is mandatory.

It must exist during task creation, not only after the task has already been created.

The Task Creation Form must include at minimum:

• Title

• Description

• Task Type

• Related Property

• Assigned Consultant

• Priority

• Status

• Due Date

• Estimated Completion Date

• Notes

• Optional Attachments

Group fields logically.

Provide inline validation.

Use enterprise form patterns.

---

# TASK WORKFLOW

Consultants must be able to:

• Edit allowed task information

• Update task status

• Register completion time

• Add notes

• View task history

Every update should automatically appear inside the Activity Timeline.

Generate a clear history of every modification.

---

# UX CONSISTENCY RULES

Every table in the product should support:

• Search

• Sorting

• Filtering

• Pagination

• Bulk selection

• Bulk actions

• Loading skeleton

• Empty state

• Error state

Never create a static enterprise table.

---

# DESIGN CONSISTENCY

Maintain complete visual consistency with the existing Zaminex Design System.

Do NOT redesign the interface.

Improve workflows only.

Respect:

• Typography

• Colors

• Component hierarchy

• Layout

• Spacing

• Shadows

• Glassmorphism

• Soft Neumorphism

Every new screen must look as if it has always been part of the product.

---

# FINAL PRODUCT QA

Before generating the final UI automatically verify:

✔ Property CRUD is fully functional.

✔ Listing CRUD is fully functional.

✔ Task CRUD is fully functional.

✔ Pagination exists for every large dataset.

✔ Listing statuses follow the required five-state lifecycle.

✔ Listing status is editable according to role permissions.

✔ Notes field exists during Task creation.

✔ Administrator and Consultant experiences remain consistent.

✔ No placeholder interface remains.

✔ No missing form exists.

✔ No broken workflow exists.

If any missing business workflow, incomplete CRUD, inconsistent permission or unfinished interface is detected, automatically redesign and complete it while preserving the premium enterprise visual identity of Zaminex.

The final result must be visually polished, production-ready, developer-friendly, enterprise-grade, and immediately suitable for frontend implementation without requiring additional UI redesign.
