# Development & Configuration Change Log

This document tracks all modifications to core configuration files (`main.css`, `tailwind.config.ts`, `app.config.ts`) and global definitions. 
**Rule**: Any modification to these files MUST be logged here to ensure recoverability.

## Log Format
- **Date**: YYYY-MM-DD
- **File(s)**: [List of modified files]
- **Description**: Brief explanation of the change.
- **Diff/Action**: What was added/removed (code snippet or summary).

---

## Change Log

### 2025-12-07
- **File(s)**: `app/assets/css/main.css`, `INSTRUCTION_UI_STANDARD.md`
- **Description**: 
    1. Restored missing `.cbre-layout-topbar` class which broke the admin/page layout design.
    2. Added `cbre-badge-circle-*` and `cbre-text-meta` classes to support Search Result UI.
    3. Added "Configuration Change Logging" directive to `INSTRUCTION_UI_STANDARD.md`.
- **Action**:
    - Added `.cbre-layout-topbar` style block.
    - Added `.cbre-badge-circle` styles.
    - Added `.cbre-text-meta` style.
