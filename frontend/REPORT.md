# BankCore Frontend — Отчёт о выполненной работе

## Статус
✅ Фронтенд собран, работает, бэкенд не тронут.

## Созданные файлы — `frontend/` (изолированно, бэкенд не изменён)

### Конфигурация и инфраструктура
| Файл | За что отвечает |
|---|---|
| `frontend/package.json` | Зависимости (React 18, Vite 6, Tailwind 3, lucide-react) и скрипты |
| `frontend/vite.config.js` | Dev-сервер на :5147 + **прокси `/api` → `localhost:8080`** (решает CORS без правки бэкенда) |
| `frontend/tailwind.config.js` | Дизайн-токены: тёмная тема `ink`, брендовый градиент teal→blue, золотой акцент, свечения, keyframe-анимации |
| `frontend/postcss.config.js` | PostCSS + Tailwind |
| `frontend/index.html` | HTML-оболочка приложения |
| `frontend/src/index.css` | Глобальные стили: скроллбары, glass/input/btn классы, утилиты градиента |
| `frontend/README.md`, `.gitignore` | Инструкция запуска и исключения git |

### Логика (`src/lib/`)
- `api.js` — обёртка над REST API;
- `format.js` — деньги ₸, таймстимпы, тоны статусов;
- `logger.jsx` — глобальная шина логов для терминала;
- `hooks.js` — `useInterval`/`useNow`.

### Компоненты (`src/components/`)
- `Layout.jsx` — сайдбар (навигация по 4 разделам, живые часы, индикатор «Core API online»)
- `AccountsPanel.jsx` + `CreateAccountForm.jsx` — дашборд счетов (карточки с балансом/номером/статусом, метрики суммарный/средний баланс) + модальная форма создания
- `TransferPanel.jsx` — переводы: выбор счёт→счёт, сумма, сводка операции, валидация, блокировка при отключённых переводах, тосты; автообновление балансов
- `AdminPanel.jsx` — тумблер переключения `volatile`-флага (+поллинг каждые 3 с), метрики активных/созданных локов, консоль асинхронного аудита
- `Terminal.jsx` — live-терминал: события реальных действий + heartbeat + поллинг `/api/admin/audit/{id}/summary`, фильтры по уровню, пауза, очистка, автоскролл, эффект сканирования и мигающий курсор
- `toast.jsx` — уведомления (success/error/warning/info) со слайд-анимацией
- `ui.jsx` — `Modal`, `Switch`, `MetricCard`, `Badge`, `StatusPill`

## Проверено
- `npm run build` — сборка без ошибок
- Прокси и API живые: `GET /api/accounts`, `/api/admin/status`, `/api/admin/audit/1/summary` отвечают через dev-сервер

## Запуск
```bash
cd frontend && npm install && npm run dev  →  http://localhost:5147
```