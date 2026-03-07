# Энергоучёт

**Открыть приложение:** [https://Smilepliz.github.io/Energy-Tracker/](https://Smilepliz.github.io/Energy-Tracker/)

Одностраничное приложение для учёта домашних электроприборов: расчёт потребления за день/неделю/месяц и аналитика (топ-5 приборов, графики, сравнение периодов). Данные хранятся в браузере (localStorage).

**Стек:** React 18, TypeScript, Vite, Ant Design, @ant-design/plots, React Router v6.

---

## Как открыть приложение

### Локально (разработка)

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите сервер разработки:
   ```bash
   npm run dev
   ```
3. Откройте в браузере адрес, который покажет Vite (обычно **http://localhost:5173**). Для корректной работы маршрутов перейдите по ссылке с базовым путём: **http://localhost:5173/Energy-Tracker/**.

### Сборка и предпросмотр

- Собрать проект: `npm run build`
- Посмотреть сборку локально: `npm run preview` — затем открыть указанный URL (часто http://localhost:4173).

### Опубликованная версия

Приложение развёрнуто на GitHub Pages — та же ссылка, что и вверху: [https://Smilepliz.github.io/Energy-Tracker/](https://Smilepliz.github.io/Energy-Tracker/). Работает без установки.

---

## Деплой на GitHub Pages

После изменений в коде можно обновить сайт:

```bash
npm run deploy
```

Скрипт соберёт проект и отправит содержимое папки `dist` в ветку `gh-pages`. В настройках репозитория (Settings → Pages) должен быть выбран источник: ветка **gh-pages**, папка **/ (root)**.
