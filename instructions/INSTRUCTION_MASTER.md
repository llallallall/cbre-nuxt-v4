## 📝 AGENT PRIORITY DIRECTIVE: Nuxt 4.x Deep Learning & Project Adherence

### 1. 🥇 PRIMARY TASK: Nuxt 4.x Documentation Mastery

The **!highest priority** is to achieve a complete and expert-level understanding of the official Nuxt 4.x documentation. This learning must precede any coding or development work related to the `cbre-nuxt-v4` project.

* **Start URL (Mandatory Learning Target):** https://nuxt.com/docs/4.x/,  https://ui.nuxt.com/docs/getting-started, https://i18n.nuxtjs.org/docs/getting-started, https://alexlavoie42.github.io/Nuxt-Mapbox/getting-started/quick-setup
* **Learning Goal:** Acquire expert-level knowledge of Nuxt 4.x architecture, APIs, conventions, and new features.
* **Methodology (In-Depth Exploration):** You must **recursively follow all internal links** and sub-documents within the scope to ensure no detail, code example, or core concept is missed.

### 2. 🧠 CORE PROJECT DIRECTIVES

After achieving documentation mastery (or while cross-referencing during development), you **MUST** strictly adhere to all subsequent instructions for the `cbre-nuxt-v4` project.

---
---

# AI Agent Master Instruction

> [!IMPORTANT]
> **READ THIS FIRST BEFORE STARTING ANY WORK**

This file serves as the entry point and single source of truth for all AI Agents working on the `cbre-nuxt-v4` project. You MUST follow the instructions linked below to ensure consistency, stability, and adherence to the project's design and architecture.

## 1. Core Principles
- **Consistency**: Always check existing code and instructions before creating something new.
- **Safety**: Do not delete or modify core components (`SelectedInfoPanel`, `Container`, `Card`) without verifying `INSTRUCTION_MIGRATION_HISTORY.md`.
- **Authentication**: Strictly follow `INSTRUCTION_AUTH.md`. Do NOT introduce `@sidebase/nuxt-auth`.

## 2. Essential Instructions
You must read and follow these documents based on your task:

| Document | Purpose |
| :--- | :--- |
| [INSTRUCTION_AUTH.md](instructions/INSTRUCTION_AUTH.md) | **Authentication**: Login flow, session management, middleware. |
| [INSTRUCTION_UI_STANDARD.md](instructions/INSTRUCTION_UI_STANDARD.md) | **UI/UX**: Design system, Nuxt UI usage, component rules (e.g., `UAccordion` slots). |
| [INSTRUCTION_MIGRATION_HISTORY.md](instructions/INSTRUCTION_MIGRATION_HISTORY.md) | **History**: Component renames, architectural decisions, rollback prevention. |
| [INSTRUCTION_PERFORMANCE.md](instructions/INSTRUCTION_PERFORMANCE.md) | **Performance**: Image optimization, icon usage, script loading. |
| [INSTRUCTION_CSS_STRATEGY.md](instructions/INSTRUCTION_CSS_STRATEGY.md) | **Styling**: Global CSS, Tailwind usage, CBRE identity. |
| [INSTRUCTION_WORKFLOW.md](instructions/INSTRUCTION_WORKFLOW.md) | **Workflow**: Cross-agent/PC consistency, task tracking. |

## 3. Quick Start Checklist
1. **Check `task.md`**: Understand the current progress and active tasks.
2. **Review Instructions**: Read the relevant instructions for your task.
3. **Check `INSTRUCTION_MIGRATION_HISTORY.md`**: Ensure you are not repeating past mistakes or reverting intentional changes.
4. **Run Typecheck**: Verify the codebase is stable before making changes (`npx nuxi typecheck`).

## 4. Critical Rules
- **Do NOT** use `rounded` prop in `ui` config for `UCard` or `UButton` if it causes type errors. Use `class="rounded-none"`.
- **Do NOT** revert `SelectedInfoPanel` to `InfoModal`.
- **ALWAYS** use `slot: 'content'` for `UAccordion` items if customizing the body.

---
**End of Master Instruction**