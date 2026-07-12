// Flor de Sal — vanilla JS
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Year
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  // Theme
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const savedTheme = localStorage.getItem("fds-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const setTheme = (dark) => {
    root.classList.toggle("dark", dark);
    localStorage.setItem("fds-theme", dark ? "dark" : "light");
    themeBtn.innerHTML = dark ? '<i class="icon-sun"></i>' : '<i class="icon-moon"></i>';
  };
  setTheme(savedTheme ? savedTheme === "dark" : prefersDark);
  themeBtn.addEventListener("click", () => setTheme(!root.classList.contains("dark")));

  // Navbar scroll + back-to-top
  const nav = $("#navbar");
  const toTop = $("#toTop");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Mobile menu
  const mm = $("#mobileMenu");
  $("#menuOpen").addEventListener("click", () => mm.classList.add("open"));
  $("#menuClose").addEventListener("click", () => mm.classList.remove("open"));
  $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => mm.classList.remove("open")));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));

  // Gallery lightbox
  const lb = $("#lightbox");
  const lbImg = lb.querySelector("img");
  $$(".g-item").forEach(btn => btn.addEventListener("click", () => {
    lbImg.src = btn.dataset.src;
    lb.classList.add("open");
  }));
  const closeLb = () => lb.classList.remove("open");
  lb.addEventListener("click", closeLb);
  lb.querySelector(".lb-close").addEventListener("click", (e) => { e.stopPropagation(); closeLb(); });
  lbImg.addEventListener("click", e => e.stopPropagation());
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

  // Menu tabs
  const tabBtns = $$(".tab-btn");
  const menuCards = $$("#menuGrid .menu-card");
  tabBtns.forEach(btn => btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    menuCards.forEach(card => {
      card.style.display = (cat === "all" || card.dataset.cat === cat) ? "" : "none";
    });
  }));

  // FAQ
  $$(".faq-item").forEach(item => {
    item.querySelector(".faq-q").addEventListener("click", () => item.classList.toggle("open"));
  });

  // Testimonials
  const testimonials = [
    { name: "Marina Alves", text: "Um lugar que abraça. O café é impecável e o atendimento me fez voltar no dia seguinte." },
    { name: "Rafael Souza", text: "Ambiente lindo, cheiro maravilhoso e um brownie que virou minha obsessão. Recomendo demais." },
    { name: "Beatriz Nunes", text: "Cada detalhe pensado com carinho. Me senti em casa desde a primeira xícara." },
    { name: "Lucas Ferreira", text: "O melhor cappuccino da região, sem exagero. E a torta artesanal é surreal." },
  ];
  const tText = $("#tText"), tName = $("#tName"), tDots = $("#tDots");
  let ti = 0;
  const renderT = () => {
    tText.style.opacity = 0;
    setTimeout(() => {
      tText.textContent = '“' + testimonials[ti].text + '”';
      tName.textContent = "— " + testimonials[ti].name;
      tText.style.opacity = 1;
      $$("#tDots span").forEach((d, i) => d.classList.toggle("active", i === ti));
    }, 150);
  };
  testimonials.forEach((_, i) => {
    const d = document.createElement("span");
    d.addEventListener("click", () => { ti = i; renderT(); });
    tDots.appendChild(d);
  });
  tText.style.transition = "opacity .3s ease";
  const go = (delta) => { ti = (ti + delta + testimonials.length) % testimonials.length; renderT(); };
  $("#tPrev").addEventListener("click", () => go(-1));
  $("#tNext").addEventListener("click", () => go(1));
  renderT();
  setInterval(() => go(1), 6000);
})();
