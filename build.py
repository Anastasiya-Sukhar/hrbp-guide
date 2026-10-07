# -*- coding: utf-8 -*-
"""Сборка автономной версии сайта: один HTML-файл со встроенными данными, стилями и скриптом."""
import io
import json
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

data = io.open("data.json", encoding="utf-8").read()
css = io.open("styles.css", encoding="utf-8").read()
app = io.open("app.js", encoding="utf-8").read()

json.loads(data)  # проверка валидности

old_fetch = '''    const res = await fetch("data.json");
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();'''
new_fetch = '''    const data = window.__DATA__;
    if (!data) throw new Error("нет данных");'''
assert old_fetch in app, "fetch block not found in app.js"
app = app.replace(old_fetch, new_fetch)

html = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HR BP: роль и влияние на бизнес</title>
  <meta name="description" content="Интерактивный методический гид по функции HR Business Partner в РТК ИТ — для руководителей">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,600&display=swap" rel="stylesheet">
  <style>
""" + css + """
  </style>
</head>
<body>
  <div class="progress-bar" id="progressBar"></div>
  <header class="header" id="header">
    <div class="container header__inner">
      <a href="#hero" class="logo">
        <span class="logo__badge">HR BP</span>
        <span class="logo__text">РТК&nbsp;ИТ &middot; методический гид</span>
      </a>
      <nav class="nav" id="nav" aria-label="Разделы"></nav>
      <button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">
        <span class="theme-toggle__icon">&#127769;</span>
      </button>
      <button class="burger" id="burger" aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <main id="content"></main>
  <footer class="footer" id="footer"></footer>
  <script>window.__DATA__ = """ + data + """;</script>
  <script>
""" + app + """
  </script>
</body>
</html>"""

with io.open("hrbp-standalone.html", "w", encoding="utf-8", newline="\n") as f:
    f.write(html)
print("OK: hrbp-standalone.html, %d chars" % len(html))
