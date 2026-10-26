# Task Manager

A local task manager for named lists. Pick a list from the sidebar, add tasks, reorder the open ones, and mark them done. Everything stays in the browser.

## What it does

- Create, rename, and remove lists. Removing a list asks for confirmation, because its tasks go with it.
- Select one list at a time. The main panel shows that list’s name, an add form, and its tasks.
- Add, edit, and remove tasks. Removing a task asks for confirmation. Edit saves with Enter and cancels with Escape.
- Reject duplicate list names and duplicate task titles in the same list. The check is case-insensitive and includes completed tasks. Renaming a list or task does not treat it as a duplicate of itself.
- Drag open tasks to reorder them. Order is the array order, so a reload keeps it.
- Mark a task done. It moves into a Completed section and can no longer be dragged. Unchecking it returns it to the open list in its stored position. The sidebar count is open tasks only.
- An empty app stays empty. Deleting every list and reloading still shows “No lists yet.”

## Stack

- [Vite](https://vite.dev/) and React 19 with TypeScript
- [Redux Toolkit](https://redux-toolkit.js.org/) for lists, the selected list, and tasks
- [Tailwind CSS](https://tailwindcss.com/) for layout and theme
- [dnd kit](https://dndkit.com/) for vertical reorder of open tasks
- [Motion](https://motion.dev/) for enter, exit, and the typewriter line. Reduced motion is respected.

There is no backend. The store is written to `localStorage` under `task-manager.lists`.

## Run it

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm run lint
npm run preview
```

## Layout

```text
src/
  App.tsx                  sidebar and selected list
  components/              button, confirm dialog, icons, typewriter
  features/lists/          sidebar and one list row
  features/tasks/          composer, list, and task card
  utils/                   store, slice, and localStorage
```

State is one slice: `lists`, each with ordered `tasks`, plus `selectedListId`. A task is `{ id, title, done }`. `done` only changes where the task is shown. It does not change its place in the array.
