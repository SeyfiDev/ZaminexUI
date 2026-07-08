# Zaminex UI Refactoring & Product Enhancement Patch (Version 2)

This document contains mandatory UI/UX improvements and product refinements that must be applied to the existing Zaminex design.

Do NOT redesign the application from scratch.

Preserve the current visual language, design system, spacing, components, animations and layout.

Only improve and extend the existing product while maintaining complete design consistency.

---

## GENERAL REQUIREMENTS

Before making any change:

• Verify whether the change belongs to:

* Administrator Panel
* Consultant Panel
* Both Panels

Do NOT blindly apply every field to both roles.

Respect role permissions and business logic.

Every new field must also appear consistently in:

* Create Form
* Edit Form
* Detail Page
* Tables
* Cards
* Filters
* Search
* Related Components

---

# CONSULTANT MODULE

Add a new field:

Branch

This field represents the consultant's office/branch.

Display it in:

* Create Consultant
* Edit Consultant
* Consultant Details
* Consultant Table
* Consultant Profile

---

# PROPERTY MODULE

Extend Property data model.

Add the following fields:

* Internal Code
* Transaction Type
* Floor
* Construction Year
* Full Address
* Property Status
* Archive Status

---

## PROPERTY FORM ORGANIZATION

The Property Creation Wizard contains five steps.

Place every new field inside the correct step.

Step 1
Basic Information

Add:

* Internal Code
* Transaction Type

Step 2
Property Details

Add:

* Floor
* Construction Year

Remove:

Bathrooms

Step 3
Location & Map

Add:

Full Address

Keep:

District

Map

Coordinates

Step 4
Media

Verify support for:

* Multiple Upload
* Drag & Drop
* Image Sorting
* Image Reordering
* Delete Image

If image management is incomplete, redesign this section.

Step 5
Review

Display every newly added field before submission.

---

## PROPERTY STATUS

Property Status currently exists on property cards only.

Move it into Property Details.

Allow users to edit status.

Suggested statuses:

Available

Reserved

Sold

Rented

Inactive

---

## PROPERTY ARCHIVE

Add Archive capability.

Administrator:

Can archive every property.

Consultant:

Can archive only properties created by themselves.

Archive should appear as:

Action Button

Status Badge

Confirmation Dialog

---

## ROLE DIFFERENCES

Consultant Panel

Remove Consultant selector from Property Creation.

The logged-in consultant automatically becomes the property owner.

Administrator Panel

Keep Consultant selector.

Administrator can assign properties to any consultant.

---

## PROPERTY LIST

Improve Property Listing.

Add:

Pagination

Recommended:

20 items per page.

(Do not hardcode the value.)

Add Filters:

Consultant

Property Type

Transaction Type

Price Range

District

Property Status

Add Search.

---

# LISTING MODULE

Complete Listing Creation.

Synchronize every field with Task #13 specifications.

Verify that every required business field exists.

Improve Listing List.

Add Pagination.

Add Filters:

Status

Consultant

Related Property

---

## LISTING STATUS

Replace current statuses.

Use exactly:

Draft

Pending Approval

Published

Expired

Inactive

---

# TASK MODULE

Extend Task entity.

Add:

Description

Creator

Related Property

Status

Due Date

Completion Date

Notes

Task Type

---

## CONSULTANT TASKS

Consultants must be able to:

Edit Tasks

Update Task Status

Register Completion Time

Write Notes

View Change History

---

## TASK FILTERS

Inside Consultant Panel add:

Status Filter

Suggested statuses:

Pending

In Progress

Completed

Cancelled

---

## TASK HISTORY

Every modification should be visible.

Display:

Status Changes

Assignment Changes

Completion Time

Notes Timeline

User Actions

---

## TASK #20 REVIEW

Review Task #20.

If current UI does not fully represent the business workflow,

redesign the interface according to the project requirements while preserving consistency with the overall design system.

---

# DESIGN CONSISTENCY

Every new field must follow the existing Design System.

Maintain:

Typography

Spacing

Input Styles

Validation

Animations

Icons

Grid System

Cards

Tables

Drawers

Side Panels

Modals

---

# UX REQUIREMENTS

Never create extremely long forms.

Maintain logical grouping.

Use progressive disclosure where appropriate.

Keep every workflow simple and enterprise-friendly.

---

# ROLE VALIDATION

Before finalizing the redesign verify:

✔ Every Administrator screen contains all required management features.

✔ Every Consultant screen contains only features allowed for consultants.

✔ Consultant-specific simplifications have been applied.

✔ Administrator-specific controls remain available.

---

# FINAL QA CHECKLIST

Verify all of the following before completing the redesign:

✔ Branch field added to Consultant module.

✔ Internal Code added.

✔ Transaction Type added.

✔ Floor added.

✔ Construction Year added.

✔ Full Address added.

✔ Property Status editable.

✔ Archive workflow added.

✔ Bathrooms removed.

✔ Consultant selector removed from Consultant Property Form.

✔ Consultant selector preserved in Administrator Property Form.

✔ Property images support reorder and deletion.

✔ Property pagination added.

✔ Property filters added.

✔ Listing pagination added.

✔ Listing filters added.

✔ Listing statuses updated.

✔ Task entity extended.

✔ Consultant task workflow completed.

✔ Task filters added.

✔ Task history completed.

✔ Task #20 reviewed.

✔ All changes applied to the correct user role.

---

FINAL INSTRUCTION

Do not introduce unnecessary visual changes.

Do not redesign the brand.

Do not change the navigation.

Do not change the color system.

Focus on refining the product, completing missing business workflows, improving usability, and making the UI production-ready while preserving the existing premium enterprise aesthetic.
