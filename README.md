# Энергоучёт

**Открыть приложение:** [https://Smilepliz.github.io/Energy-Tracker/](https://Smilepliz.github.io/Energy-Tracker/)

Одностраничное приложение для учёта домашних электроприборов: расчёт потребления за день/неделю/месяц и аналитика (топ-5 приборов, графики, сравнение периодов). Данные хранятся в браузере (localStorage).

**Стек:** React 18, TypeScript, Vite, Ant Design, @ant-design/plots, React Router v6.

---

## Деплой на GitHub Pages

После изменений в коде можно обновить сайт:

```bash
npm run deploy
```

Скрипт соберёт проект и отправит содержимое папки `dist` в ветку `gh-pages`. В настройках репозитория (Settings → Pages) должен быть выбран источник: ветка **gh-pages**, папка **/ (root)**.
