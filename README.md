# Warehouse Catalog

Адмін-панель каталогу товарів складу — тестове завдання.
Стек: **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 + React Query v5 + Valtio + json-server**.

---

## Запуск

```bash
# 1. Встановити залежності
npm install

# 2. Скопіювати приклад env (за замовчуванням mock крутиться на :4000)
cp .env.local.example .env.local

# 3. Підняти mock-сервер у першому терміналі
npm run mock (або npx json-server --watch db.json --port 4000 --host 0.0.0.0)

# 4. У другому терміналі — Next.js dev-server
npm run dev
```

Додаток буде доступний на `http://localhost:3000`, mock API — на `http://localhost:4000`.

### Доступні скрипти

| Команда | Призначення |
|---|---|
| `npm run dev` | Next.js dev-сервер |
| `npm run build` | Продакшн-збірка |
| `npm run start` | Запуск збірки |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run mock` | json-server на `:4000` |
| `npm test` | Vitest у watch-режимі |
| `npm run test:run` | Vitest однократно |

---

## Структура

```
src/
  app/
    (dashboard)/
      products/                # /products, /products/new, /products/[id]
      suppliers/               # /suppliers
      _components/             # Sidebar, Header
      layout.tsx               # сітка sidebar + header + main
    error.tsx                  # root error boundary (бонус)
    not-found.tsx
    layout.tsx                 # html, providers, ToastsHost
    globals.css                # @import "tailwindcss" + flatpickr CSS
  features/
    products/
      api.ts                   # listProducts / get / create / update / patch / delete
      schema.ts                # zod-схема форми
      store.ts                 # Valtio: фільтри, сорт, пагінація, виділення
      types.ts
      hooks/
        useProductsQuery.ts    # + useProductQuery
        useProductMutations.ts # create / update / delete / toggleActive (optimistic) / bulk
      components/
        UrlBootstrap.tsx       # синхронізація store ↔ URL
        ProductsFilters.tsx    # debounced search + async-paginate + flatpickr range
        ProductsTable.tsx      # generic DataTable; barcode, rating, active toggle
        ProductsPagination.tsx
        BulkActionsBar.tsx     # bulk delete / activate / deactivate (бонус)
        ExportCsvButton.tsx    # CSV-експорт (бонус)
        ProductForm.tsx        # RHF + zod, авто-SKU, штрихкод-превʼю
        ImageDropzone.tsx      # base64 у db.json
        BarcodePreview.tsx
      utils/sku.ts
    categories/
      api.ts, types.ts
      components/CategoryAsyncSelect.tsx   # react-select-async-paginate
    suppliers/
      api.ts, types.ts
      hooks/useSuppliersQuery.ts
      components/{SuppliersTable, SupplierSelect}.tsx
  shared/
    lib/
      api.ts            # axios instance + інтерсептор на 5xx → toast
      cn.ts             # tailwind-merge утиліта
      csv.ts            # toCsv + downloadCsv
      queryClient.ts    # фабрика QueryClient
      QueryProvider.tsx
      toastsStore.ts    # Valtio store + pushToast/dismissToast
    ui/                 # Button, Input, Textarea, Checkbox, Label, Skeleton,
                        # EmptyState, ErrorState, ToastsHost, Tooltip (popperjs),
                        # HelpTooltip, DataTable<T>, Pagination, ConfirmDialog,
                        # DatePicker, DateRangePicker
    icons/              # *.svg як React-компоненти через @svgr/webpack
    types.ts            # Paginated<T>, PageParams
```

Feature-based організація з `src/shared` для переюзу.

---

## Архітектурні рішення

### Server state vs UI state

- **React Query** — все, що лежить на сервері (`['products', filters]`, `['product', id]`, `['suppliers']`, `['categories', ...]`).
- **Valtio** — UI-state, що не дублює серверний:
  - `productsStore` — фільтри/сорт/пагінація/виділення на сторінці `/products`.
  - `toastsStore` — глобальні сповіщення.

### URL-синхронізація

`UrlBootstrap` на маунті читає `useSearchParams` і заповнює `productsStore`, далі підписується на зміни store через `subscribe(productsStore)` і пушить новий query string через `router.replace()`. Перезавантаження `/products?search=Drill&sort=price&order=desc` повністю відновлює стан.

### Mock API нюанси

- **Пошук за назвою**: ТЗ просить пошук _саме_ за назвою, тому використовується `name_like` (json-server, regex-match), а не `q` (full-text по всіх полях).
- **Діапазон дат**: `receivedAt_gte` / `receivedAt_lte`.
- **Сортування**: серверне через `_sort` / `_order`.
- **Пагінація**: `_page` / `_limit`, total — з заголовка `X-Total-Count`.
- **Зображення**: json-server не приймає файли, тому в формі дропзона читає файли через `FileReader.readAsDataURL()` і зберігає `data:image/...;base64,...` прямо в `db.json`. Через 2 MB-ліміт на файл і максимум 5 фото (валідація з ТЗ) це працює, хоч і роздуває JSON.

### Optimistic updates

`useToggleActive` чекбоксу `active` у списку:
- `onMutate` → `cancelQueries` + збір snapshot усіх кешів `['products', ...]` + `setQueryData` з `active` оновленим.
- `onError` → відкат до snapshot.
- `onSettled` → `invalidateQueries`.

### Tooltip

Власний компонент `<Tooltip>` поверх `@popperjs/core` (`createPopper` + `react-dom/createPortal`), без сторонніх обгорток. Ховером і фокусом керує сам компонент, `aria-describedby` встановлюється коли тултип відкритий.

### Generic DataTable

`<DataTable<T>>` у `shared/ui` обслуговує і `/products`, і `/suppliers`: передаєш `columns`, `rows`, опційно `selectable`/`sort`/`onSortChange`. Скелетон, empty- та error-стани вмонтовані всередину.

---

## Бонуси (всі реалізовані)

- Optimistic update чекбоксу `active` у списку.
- Bulk actions у `BulkActionsBar` — масові delete / activate / deactivate з `<ConfirmDialog>`.
- Error boundary на root (`app/error.tsx`) і на `/products` (`app/(dashboard)/products/error.tsx`).
- CSV-експорт — `ExportCsvButton` тягне всі товари з поточними фільтрами і завантажує `.csv` (з UTF-8 BOM).
- Юніт-тести (Vitest):
  - `src/shared/lib/cn.test.ts` — поведінка `cn()`.
  - `src/features/products/hooks/useProductsQuery.test.tsx` — рендер хука з `vi.mock('@/shared/lib/api')`.

---

## Відео та скриншоти

- Loom: https://www.loom.com/share/6a77bcf0113349789a43affac3b51e4f
- Screenshots: https://drive.google.com/drive/folders/13VD5AnknHLjgzd_gSjmgD33Awbp0ygXs?usp=sharing
