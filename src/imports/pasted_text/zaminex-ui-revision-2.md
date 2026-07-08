# ZAMINEX ENTERPRISE UI REVISION SPRINT

## Functional Fixes, Workflow Completion & UX Refinements

Continue working on the existing Zaminex Enterprise Real Estate CRM.

This is **NOT** a redesign.

Preserve the existing visual language, design system, layout, colors, typography, neumorphism, glassmorphism, spacing, components, and interaction patterns.

Only implement the following functional and UX improvements while maintaining complete visual consistency.

Every modification must remain production-ready and enterprise-grade.

---

# GLOBAL RULES

Before implementing any change:

• Analyze affected Administrator workflows.

• Analyze affected Advisor workflows.

• Verify CRUD completeness.

• Verify navigation consistency.

• Verify role permissions.

• Verify responsive behavior.

• Propagate every change throughout the entire product.

Never update only one screen if the same business rule affects other modules.

---

# PROPERTY LIST

## Edit Property Action

The current Edit button incorrectly opens the "Create Property" page.

Replace this behavior.

Clicking **Edit** must always open the dedicated **Edit Property Workspace** with all existing property data preloaded.

Create Property and Edit Property must remain separate workflows.

Editing must never navigate to the Create screen.

---

## Property Details → Create Listing

Inside the Property Details page there is a **+ Create Listing** button that currently has no functionality.

Implement a complete workflow.

Clicking this button must launch the complete Listing Creation Wizard.

The currently opened Property must be automatically pre-selected.

The user should never need to manually select the same property again.

---

# PROPERTY LIST PAGINATION

Ensure the Property List supports enterprise-scale datasets.

Implement production-ready pagination including:

• Configurable page size (10 / 20 / 50 / 100)

• Previous / Next

• First / Last

• Current page indicator

• Jump to page

• Total records

• Sticky pagination footer

Pagination must work correctly together with:

• Search

• Filters

• Sorting

---

# PROPERTY LIST VIEW TOGGLE

The Property List already supports Card View and List View.

Extend the exact same experience to the Listing List.

Both Administrator and Advisor portals must support:

• Card View

• List View

• Smooth animated switching

• Persistent user preference (remember last selected view)

Maintain complete visual consistency with the Property module.

---

# LISTING CREATION WORKSPACE

Complete the Listing Creation workflow.

Generate a fully functional Create Listing experience in both:

Administrator Portal

Advisor Portal

Synchronize every field with the existing business requirements (Task #12 and Task #13).

Do not leave placeholder content.

Generate complete:

• Create

• Edit

• Details

• Validation

• Review

• Confirmation

---

# LISTING LIST

Implement enterprise-grade pagination.

Support:

• Configurable page size

• Previous / Next

• First / Last

• Total listings

• Sticky pagination

• Preserve filters during navigation

The Listing List must scale gracefully to thousands of records.

---

# LISTING STATUS SYSTEM

Replace the existing status workflow.

Listing status must contain exactly five business states:

• Draft

• Pending Approval

• Published

• Expired

• Inactive

Each status requires:

• Badge

• Icon

• Color

• Description

• Status History

• Editable Workflow

Administrators can manage all status transitions.

Advisors may edit listings according to their role permissions while respecting the approval workflow.

Every status update must automatically propagate to:

• Tables

• Cards

• Detail pages

• Activity Timeline

• Reports

• Analytics

---

# TASK MANAGEMENT

## Filter Button

The Filter button inside the Administrator Task List currently has no functionality.

Replace it with a complete enterprise filtering system.

Provide filtering by:

• Status

• Priority

• Assigned Consultant

• Related Property

• Due Date

• Task Type

• Completion Status

Filters should support:

• Multi-select

• Clear All

• Saved Filters

• Instant update

---

## Task Creation

The Notes field must exist during Task creation.

Do not add Notes only after the task has already been created.

Generate a complete enterprise Task Creation form including:

• Title

• Description

• Task Type

• Related Property

• Assigned Consultant

• Priority

• Status

• Due Date

• Completion Date

• Notes

• Optional Attachments

---

# FOLLOW-UP MODULE

## Advisor Permissions

Verify that Advisors can create Follow-Ups.

If this workflow is incomplete, implement the full Create Follow-Up experience.

---

## Assigned To Field

Advisor Portal

The Assigned To field must automatically use the currently authenticated Advisor.

The field must be locked and non-editable.

Administrator Portal

The Assigned To field must remain fully editable.

Administrators can assign Follow-Ups to any consultant.

---

## Linked Property Selector

Replace the current property selector.

Use the premium Searchable Combobox component already used elsewhere in the product.

Requirements:

• Live search

• Keyboard navigation

• Large dataset support

• Consistent styling

---

# SEARCHABLE COMBOBOX STANDARD

Replace every basic dropdown listed below with the enterprise Searchable Combobox already used in the Property module.

Use the exact same interaction pattern and visual style.

### Admin → Property List Filters

• Consultants

• Districts

---

### Admin & Advisor → Listing List Filters

• Consultants

• Properties

---

### Admin & Advisor → Create Listing

Section 2 — Property

Replace **Select Property** with a searchable selector supporting instant search and keyboard navigation.

---

### Admin & Advisor → Create Follow-Up

Replace **Linked Property** with the same searchable selector.

---

# ENTERPRISE CONSISTENCY

Every searchable selector must support:

• Instant search

• Keyboard navigation

• Highlighted matching text

• Empty state

• Loading state

• Large dataset optimization

• Consistent animations

• Responsive behavior

Never mix different dropdown styles across the application.

---

# PRODUCT QA

Before generating the updated UI automatically verify:

✔ Edit Property opens the correct Edit workflow.

✔ Create Listing works from Property Details.

✔ Property pagination is complete.

✔ Listing pagination is complete.

✔ Listing View Toggle exists.

✔ Listing status lifecycle is complete.

✔ Task Filter is fully functional.

✔ Notes exist during Task creation.

✔ Advisors can create Follow-Ups.

✔ Assigned To follows role permissions.

✔ Every required selector uses the Searchable Combobox.

✔ No placeholder buttons remain.

✔ No broken workflow remains.

✔ No incomplete CRUD remains.

If any missing functionality or inconsistent UX is detected, automatically redesign and complete it while preserving the current premium enterprise design language.

---

# FINAL REQUIREMENT

Do not redesign the product.

Do not modify the established design language.

Focus only on completing unfinished workflows, fixing broken interactions, improving enterprise usability, and ensuring production readiness.

The final UI must be visually identical to the current Zaminex style while being fully functional, internally consistent, scalable, and ready for frontend implementation.
