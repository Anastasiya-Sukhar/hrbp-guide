/* HR BP: роль и влияние на бизнес — интерактивный гид.
   Весь контент загружается из data.json. Аудитория — руководители. */

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

/* Пины (карточки) циклично получают пастельный оттенок */
const pinClass = (i) => `pin pin-${(i % 6) + 1}`;

/* ---------- Тема ---------- */
function initTheme() {
  const saved = localStorage.getItem("hrbp-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("hrbp-theme", next);
    applyTheme(next);
  });
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#themeToggle .theme-toggle__icon").textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ---------- Каркас секции ---------- */
function sectionShell(id, kicker, headHtml) {
  return `<section class="section" id="${id}">
    <div class="container">
      <div class="section__head reveal">
        <div class="section__kicker">${kicker}</div>
        ${headHtml}
      </div>
      <div class="section__body"></div>
    </div>
  </section>`;
}

function renderPin(c, i, delay) {
  return `<article class="${pinClass(i)} reveal" data-delay="${delay}">
    ${c.icon ? `<div class="pin__icon">${c.icon}</div>` : ""}
    ${c.num ? `<div class="pin__num">${c.num}</div>` : ""}
    <h3 class="pin__title">${c.title}</h3>
    <p class="pin__text">${c.text}</p>
    ${c.tag ? `<span class="pin__tag">${c.tag}</span>` : ""}
  </article>`;
}

function modelNode(n, accent) {
  return `<article class="scheme-node ${accent ? "accent" : ""} reveal">
    <div class="scheme-node__icon">${n.icon}</div>
    <h3 class="scheme-node__name">${n.name}</h3>
    <div class="scheme-node__role">${n.role}</div>
    <p class="scheme-node__details">${n.details}</p>
  </article>`;
}

/* ---------- Рендер всех секций ---------- */
function renderAll(d) {
  document.title = d.meta.title;
  const main = $("#content");

  /* Навигация */
  const nav = $("#nav");
  d.nav.forEach((n) => {
    const a = el("a", null, n.label);
    a.href = "#" + n.id;
    nav.appendChild(a);
  });

  /* Главный экран */
  main.insertAdjacentHTML("beforeend", `
    <section class="hero" id="hero">
      <div class="hero__glow hero__glow--1"></div>
      <div class="hero__glow hero__glow--2"></div>
      <div class="container">
        <div class="hero__inner">
          <span class="hero__eyebrow">${d.hero.eyebrow}</span>
          <span class="hero__audience">${d.hero.audienceChip}</span>
          <h1 class="hero__title">${d.hero.title}</h1>
          <p class="hero__subtitle">${d.hero.subtitle}</p>
          <a href="#why" class="hero__cta">${d.hero.cta}</a>
          <div class="hero__stats">
            ${d.hero.stats.map((s) => `<div class="hero__stat"><b>${s.value}</b><span>${s.label}</span></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="hero__scroll-hint">листайте</div>
    </section>
  `);

  /* 1. Почему это разговор о бизнесе, а не о HR */
  main.insertAdjacentHTML("beforeend", sectionShell("why", "01 · Контекст", `
    <h2 class="section__title">${d.whyBusiness.title}</h2>
    <p class="section__subtitle">${d.whyBusiness.subtitle}</p>`));
  const whyBody = $("#why .section__body");
  whyBody.className = "masonry";
  d.whyBusiness.cards.forEach((c, i) =>
    whyBody.insertAdjacentHTML("beforeend", renderPin(c, i, i)));

  /* 2. Что на кону для компании */
  main.insertAdjacentHTML("beforeend", sectionShell("stakes", "02 · Ставки", `
    <h2 class="section__title">${d.stakes.title}</h2>
    <p class="section__subtitle">${d.stakes.subtitle}</p>`));
  const stakesBody = $("#stakes .section__body");
  stakesBody.className = "masonry";
  d.stakes.cards.forEach((c, i) =>
    stakesBody.insertAdjacentHTML("beforeend", renderPin(c, i, i)));

  /* 3. Как устроен современный HR — редакционный блок */
  main.insertAdjacentHTML("beforeend", sectionShell("model", "03 · Архитектура", `
    <h2 class="section__title">${d.model.title}</h2>`));
  const modelBody = $("#model .section__body");
  modelBody.className = "editorial";
  modelBody.innerHTML = `
    <p class="editorial__lead reveal">${d.model.lead}</p>
    <div class="editorial__note reveal" data-delay="1">${d.model.ulrich}</div>`;

  /* 4. Схема взаимодействия: бизнес — HR BP — ЦК */
  main.insertAdjacentHTML("beforeend", sectionShell("scheme", "04 · Схема", `
    <h2 class="section__title">${d.scheme.title}</h2>
    <p class="section__subtitle">${d.scheme.subtitle}</p>`));
  const schemeBody = $("#scheme .section__body");
  const [biz, hrbp, ck] = d.scheme.nodes;
  schemeBody.className = "scheme";
  schemeBody.innerHTML = `
    ${modelNode(biz, false)}
    <div class="scheme__link reveal"><span>⇄</span></div>
    ${modelNode(hrbp, true)}
    <div class="scheme__link reveal"><span>⇄</span></div>
    ${modelNode(ck, false)}`;

  /* 5. Кто такой HR бизнес-партнёр */
  main.insertAdjacentHTML("beforeend", sectionShell("who", "05 · Определение", `
    <h2 class="section__title">${d.whoIs.title}</h2>`));
  const whoBody = $("#who .section__body");
  whoBody.className = "who";
  whoBody.innerHTML = `
    <p class="who__text reveal">${d.whoIs.text}</p>
    <blockquote class="who__quote reveal" data-delay="1">
      <p>${d.whoIs.manifesto.quote}</p>
      <cite>${d.whoIs.manifesto.source}</cite>
    </blockquote>`;

  /* 6. Что делает HR бизнес-партнёр */
  main.insertAdjacentHTML("beforeend", sectionShell("zones", "06 · Полевые работы", `
    <h2 class="section__title">${d.zones.title}</h2>
    <p class="section__subtitle">${d.zones.subtitle}</p>`));
  const zonesBody = $("#zones .section__body");
  zonesBody.className = "masonry masonry--tight";
  d.zones.items.forEach((c, i) =>
    zonesBody.insertAdjacentHTML("beforeend", renderPin(c, i, i % 3)));

  /* 7. Влияние на бизнес */
  main.insertAdjacentHTML("beforeend", sectionShell("impact", "07 · Эффекты", `
    <h2 class="section__title">${d.impact.title}</h2>
    <p class="section__subtitle">${d.impact.subtitle}</p>`));
  const impactBody = $("#impact .section__body");
  impactBody.className = "masonry";
  d.impact.cards.forEach((c, i) =>
    impactBody.insertAdjacentHTML("beforeend", renderPin(c, i, i)));

  /* 8. Три уровня зрелости роли */
  main.insertAdjacentHTML("beforeend", sectionShell("maturity", "08 · Развитие", `
    <h2 class="section__title">${d.maturity.title}</h2>
    <p class="section__subtitle">${d.maturity.subtitle}</p>`));
  const matBody = $("#maturity .section__body");
  matBody.className = "levels";
  d.maturity.levels.forEach((lv, i) => {
    matBody.insertAdjacentHTML("beforeend", `
      <article class="level ${lv.featured ? "level--featured" : ""} ${pinClass(i)} reveal" data-delay="${i}">
        ${lv.featured ? '<div class="level__badge">ядро функции</div>' : ""}
        <div class="level__scope">${lv.scope}</div>
        <h3 class="level__name">${lv.name}</h3>
        <p class="level__text">${lv.text}</p>
        <div class="level__skills">${lv.skills.map((s) => `<span>✓ ${s}</span>`).join("")}</div>
      </article>`);
  });
  $("#maturity .container").insertAdjacentHTML("beforeend", `
    <div class="note reveal">
      <span class="note__icon">📌</span>
      <div>${d.maturity.note}</div>
    </div>`);

  /* 9. Наша команда HR BP сегодня */
  main.insertAdjacentHTML("beforeend", sectionShell("team", "09 · Команда", `
    <h2 class="section__title">${d.team.title}</h2>
    <p class="section__subtitle">${d.team.subtitle}</p>`));
  const teamBody = $("#team .section__body");
  teamBody.className = "masonry masonry--tight";
  d.team.items.forEach((c, i) =>
    teamBody.insertAdjacentHTML("beforeend", renderPin(c, i, i % 3)));
  $("#team .container").insertAdjacentHTML("beforeend", `
    <div class="note note--soft reveal">
      <span class="note__icon">🔒</span>
      <div>${d.team.note}</div>
    </div>`);

  /* 10. Сервис или партнёр — в чём разница */
  main.insertAdjacentHTML("beforeend", sectionShell("svp", "10 · Разница подходов", `
    <h2 class="section__title">${d.svP.title}</h2>
    <p class="section__subtitle">${d.svP.subtitle}</p>`));
  const svpBody = $("#svp .section__body");
  svpBody.innerHTML = `
    <div class="svp-toggle reveal" role="tablist">
      <button data-mode="service" class="active" role="tab" aria-selected="true">🔧 Сервис</button>
      <button data-mode="partner" role="tab" aria-selected="false">🤝 Партнёр</button>
    </div>
    <div class="svp-table-wrap reveal" data-delay="1">
      <table class="svp-table" data-mode="service">
        <thead>
          <tr>
            <th>${d.svP.columns[0]}</th>
            <th class="col-service">🔧 ${d.svP.columns[1]}</th>
            <th class="col-partner">🤝 ${d.svP.columns[2]}</th>
          </tr>
        </thead>
        <tbody>
          ${d.svP.rows.map((r) => `
            <tr>
              <td class="svp-case">${r.case}</td>
              <td class="svp-cell td-service">${r.service}</td>
              <td class="svp-cell td-partner">${r.partner}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <p class="svp-hint reveal" data-delay="2">Нажимайте на переключатель выше — сравнивайте, как один и тот же запрос звучит для сервиса и для партнёра.</p>`;

  /* 11. Итог для бизнеса */
  main.insertAdjacentHTML("beforeend", sectionShell("final", "11 · Резюме", `
    <h2 class="section__title">${d.final.title}</h2>`));
  const finalBody = $("#final .section__body");
  finalBody.innerHTML = `
    <div class="theses">
      ${d.final.theses.map((t, i) => `
        <article class="${pinClass(i)} thesis reveal" data-delay="${i}">
          <div class="thesis__num">${t.num}</div>
          <h3 class="thesis__title">${t.title}</h3>
          <p class="thesis__text">${t.text}</p>
        </article>`).join("")}
    </div>
    <div class="quiz reveal">
      <h3 class="quiz__title">🎯 ${d.final.quiz.title}</h3>
      <div class="quiz__questions"></div>
      <div class="quiz__result" id="quizResult"></div>
      <button class="quiz__restart" id="quizRestart" style="display:none">${d.final.quiz.restart}</button>
    </div>`;

  renderQuiz(d.final.quiz);

  /* Футер */
  $("#footer").innerHTML = `
    <div class="container footer__inner">
      <p class="footer__text">${d.footer.text} · ${d.footer.year}</p>
      <span class="footer__privacy">🔒 ${d.footer.privacy}</span>
    </div>`;
}

/* ---------- Квиз ---------- */
function renderQuiz(quiz) {
  const wrap = $(".quiz__questions");
  let score = 0;
  let answered = 0;

  quiz.questions.forEach((q, qi) => {
    const qEl = el("div", "quiz__q");
    qEl.appendChild(el("p", "quiz__q-text", `${qi + 1}. ${q.q}`));
    const explain = el("div", "quiz__explain", "💡 " + q.explain);

    q.options.forEach((opt, oi) => {
      const btn = el("button", "quiz__opt", `<span class="opt-dot"></span><span>${opt}</span>`);
      btn.addEventListener("click", () => {
        if (qEl.dataset.done) return;
        qEl.dataset.done = "1";
        answered++;
        const opts = qEl.querySelectorAll(".quiz__opt");
        opts.forEach((b, i) => {
          b.disabled = true;
          if (i === q.correct) b.classList.add("correct");
          if (i === oi && i !== q.correct) b.classList.add("wrong");
        });
        if (oi === q.correct) score++;
        explain.classList.add("show");
        if (answered === quiz.questions.length) showResult();
      });
      qEl.appendChild(btn);
    });
    qEl.appendChild(explain);
    wrap.appendChild(qEl);
  });

  function showResult() {
    const r = $("#quizResult");
    const title =
      score === quiz.questions.length ? quiz.resultTitles.perfect :
      score >= quiz.questions.length - 1 ? quiz.resultTitles.good :
      quiz.resultTitles.low;
    r.innerHTML = `<b>${title}</b><span>Результат: ${score} из ${quiz.questions.length}</span>`;
    r.classList.add("show");
    const restart = $("#quizRestart");
    restart.style.display = "block";
    restart.onclick = () => {
      wrap.innerHTML = "";
      r.classList.remove("show");
      restart.style.display = "none";
      renderQuiz(quiz);
    };
  }
}

/* ---------- Интерактив: reveal, навигация, прогресс ---------- */
function initInteractions() {
  /* Появление при скролле */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  /* Шапка + прогресс-бар */
  const header = $("#header");
  const bar = $("#progressBar");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Активный пункт меню */
  const links = document.querySelectorAll(".nav a");
  const sections = [...links].map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      }
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* Бургер-меню */
  const burger = $("#burger");
  const nav = $("#nav");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    nav.classList.toggle("open");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      burger.classList.remove("open");
      nav.classList.remove("open");
    }
  });

  /* Переключатель Сервис/Партнёр */
  const svpTable = $(".svp-table");
  if (svpTable) {
    document.querySelectorAll(".svp-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".svp-toggle button").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        svpTable.dataset.mode = btn.dataset.mode;
      });
    });
  }
}

/* ---------- Запуск ---------- */
(async function init() {
  initTheme();
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    renderAll(data);
    initInteractions();
  } catch (err) {
    $("#content").innerHTML = `
      <div style="padding:120px 24px;text-align:center;font-size:17px">
        Не удалось загрузить данные (data.json).<br>
        <small style="opacity:.6">Откройте сайт через локальный сервер, а не как файл.</small>
      </div>`;
  }
})();
