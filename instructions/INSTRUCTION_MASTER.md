# 🧭 AI Agent Master Instruction

> [!IMPORTANT]
> **READ THIS FIRST BEFORE STARTING ANY WORK**

This file serves as the **Index**, **Entry Point**, and **Workflow Protocol** for all AI Agents working on the `cbre-nuxt-v4` project. Follow these documents to ensure consistency, stability, and quality.

---

## 1. Documentation Index

| Category | Document | Description |
| :--- | :--- | :--- |
| **UX & Styling** | **[`INSTRUCTION_UI_STANDARD.md`](INSTRUCTION_UI_STANDARD.md)** | **Single Source of Truth** for UI, CSS Naming, Z-Index, and Performance (Icons/Images). |
| **Security** | **[`INSTRUCTION_SECURITY_STANDARD.md`](INSTRUCTION_SECURITY_STANDARD.md)** | Authentication (Login/Session), SQL Injection, XSS, CSRF. |
| **Components** | **[`INSTRUCTION_FEATURE_GUIDES.md`](INSTRUCTION_FEATURE_GUIDES.md)** | Specific implementations: Address Search (Kakao), PDF Viewer. |
| **Localization** | **[`INSTRUCTION_LOCALE.md`](INSTRUCTION_LOCALE.md)** | **i18n Strategy**, Hybrid Approach (Nuxt UI + i18n), Key Naming Conventions. |
| **History** | **[`INSTRUCTION_DEV_LOG.md`](INSTRUCTION_DEV_LOG.md)** | Project Chronology, Major Decision Logs, Rollback Prevention. |
| **Errors** | **[`INSTRUCTION_TROUBLESHOOTING.md`](INSTRUCTION_TROUBLESHOOTING.md)** | Known issues and solutions (Hydration, Server 500, etc.). |

---

## 2. Cross-Agent Workflow Protocol

Follow this checklist strictly when switching between PCs or starting a new session.

### Phase 1: Preparation
1.  **Sync State**: Ensure you have the latest code (`git pull`) and dependencies (`npm install`).
2.  **Check Status**: Review `task.md` and `INSTRUCTION_DEV_LOG.md` to understand recent changes.

### Phase 2: Execution Rules
- **Consistency**:
  - Building UI? -> Follow `INSTRUCTION_UI_STANDARD.md`.
  - Touching Auth? -> Follow `INSTRUCTION_SECURITY_STANDARD.md`.
  - **Handling Text/i18n?** -> Follow `INSTRUCTION_LOCALE.md`.
- **Troubleshooting**:
  - Encountered "Hydro mismatch" or "500 Error"? -> Check `INSTRUCTION_TROUBLESHOOTING.md` *before* trying to fix it blindly.

### Phase 3: Documentation (Exit)
- **Log Errors**: If you solved a new tricky error, add it to `INSTRUCTION_TROUBLESHOOTING.md`.
- **Log History**: If you made a major architectural decision, add it to `INSTRUCTION_DEV_LOG.md`.
- **Update Task**: Mark progress in `task.md`.

---

## 3. Critical Rules (Do Not Ignore)

- **Authentication**: Usage of `@sidebase/nuxt-auth` is **FORBIDDEN**. Use `nuxt-auth-utils`.
- **CSS**: Arbitrary Z-Indexes (e.g., `z-[999]`) are **FORBIDDEN**. Use the Semantic Scale in UI Standards.
- **Styling**: All new classes MUST follow `cbre-[Category]-[Function]-...`.
- **State**: `SelectedInfoPanel` must NOT be reverted to `InfoModal`.

## 4. UX & Interaction Standards (Tooltip Policy)

1.  **Universal Hover Tooltips**: Every element with user interaction (hover/click) MUST have a `UTooltip`.
2.  **Descriptive Content**: Tooltip text must be **intuitive and descriptive sentences** (e.g., "Reset map view to default" instead of "Reset"). Avoid single-word titles.
3.  **History Tracking**: All tooltip implementations must be logged in [`tooltip_history.md`](../tooltip_history.md).