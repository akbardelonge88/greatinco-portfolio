/* ========================================
   GREATINCO SHARED SCRIPT - FINAL
   - Page loader
   - Mobile menu
   - Language switcher
   - Service card keyboard flip
   - Contact form
   - Reusable stagger reveal
   - Business numbers counter
   - Team modal
   ======================================== */
(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initPageLoader() {
    const loader = qs("#page-loader");

    window.addEventListener("load", () => {
      document.body.classList.add("page-loaded");

      if (!loader) return;

      window.setTimeout(() => {
        loader.classList.add("zoom-out");

        window.setTimeout(() => {
          loader.style.display = "none";
        }, 900);
      }, 800);
    });
  }

  function initMobileMenu() {
    const toggle = qs("#menuToggle");
    const menu = qs("#mainMenu");

    if (!toggle || !menu) return;

    const dropdownParents = qsa(".has-dropdown", menu);

    const closeAllSubmenus = () => {
      dropdownParents.forEach((item) => {
        item.classList.remove("submenu-open");
        const trigger = qs(":scope > a", item);
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    };

    const openMenu = () => {
      menu.classList.add("active");
      toggle.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    };

    const closeMenu = () => {
      menu.classList.remove("active");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      closeAllSubmenus();
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (menu.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });

    dropdownParents.forEach((item) => {
      const trigger = qs(":scope > a", item);
      const submenu = qs(":scope > .dropdown-menu", item);

      if (!trigger || !submenu) return;

      trigger.setAttribute("aria-expanded", "false");

      trigger.addEventListener("click", (event) => {
        if (window.innerWidth > 768) return;

        event.preventDefault();
        event.stopPropagation();

        const isOpen = item.classList.contains("submenu-open");

        dropdownParents.forEach((other) => {
          if (other === item) return;
          other.classList.remove("submenu-open");
          const otherTrigger = qs(":scope > a", other);
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });

        item.classList.toggle("submenu-open", !isOpen);
        trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  function initLanguageSwitcher() {
    const switcher = qs("#langSwitcher");
    const trigger = qs("#langTrigger");
    const menu = qs("#langMenu");

    if (!switcher || !trigger || !menu) return;

    const closeSwitcher = () => {
      switcher.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      switcher.classList.toggle("open");
      trigger.setAttribute(
        "aria-expanded",
        switcher.classList.contains("open") ? "true" : "false"
      );
    });

    document.addEventListener("click", (event) => {
      if (!switcher.contains(event.target)) closeSwitcher();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSwitcher();
    });
  }

  function initServiceCards() {
    const cards = qsa(".service-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.classList.toggle("force-flip");
        }

        if (event.key === "Escape") {
          card.classList.remove("force-flip");
        }
      });

      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) {
          card.classList.remove("force-flip");
        }
      });
    });
  }

  function initContactForm() {
    const form = qs("#contactForm");
    const hint = qs("#formHint");
    const submitBtn = qs("#submitBtn");

    if (!form || !hint || !submitBtn) return;

    const defaultLabel = submitBtn.textContent.trim() || "Kirim Permohonan";
    const loadingLabel = "Mengirim...";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      hint.textContent = "Terima kasih! Tim kami akan segera menghubungi Anda.";
      hint.style.color = "green";

      submitBtn.disabled = true;
      submitBtn.textContent = loadingLabel;

      window.setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }, 700);
    });
  }

  function initReusableStaggerReveal() {
    const sections = qsa(".reveal-stagger");
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const revealItems = (section) => {
      if (section.dataset.revealed === "true") return;

      const items = qsa(".reveal-item", section);
      const staggerDelay = Number.parseInt(section.dataset.stagger || "220", 10);

      items.forEach((item, index) => {
        window.setTimeout(() => {
          item.classList.add("is-visible");
        }, index * staggerDelay);
      });

      section.dataset.revealed = "true";
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealItems(entry.target);
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initBusinessNumbers() {
    const section = qs("#numbers");
    if (!section || typeof IntersectionObserver === "undefined") return;

    const rows = qsa(".biznum-row", section);
    if (!rows.length) return;

    const formatNumber = (value) => {
      return value.toLocaleString("id-ID");
    };

    const animateCount = (element, target, duration = 1400) => {
      const start = performance.now();

      const step = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);

        element.textContent = formatNumber(value);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = formatNumber(target);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        rows.forEach((row, index) => {
          window.setTimeout(() => {
            row.classList.add("is-animate");
            const counter = qs(".biznum-counter", row);
            if (!counter) return;

            const target = Number.parseInt(row.dataset.target || "0", 10);
            animateCount(counter, Number.isNaN(target) ? 0 : target);
          }, index * 180);
        });

        obs.disconnect();
      });
    }, { threshold: 0.35 });

    observer.observe(section);
  }

  function initTeamModal() {
    const cards = qsa(".team-card.premium");
    const modal = qs("#teamModal");
    const closeBtn = qs("#teamModalClose");
    const overlay = qs(".team-modal-overlay");
    const modalPhoto = qs("#teamModalPhoto");
    const modalName = qs("#teamModalName");
    const modalRole = qs("#teamModalRole");
    const modalBio = qs("#teamModalBio");

    if (
      !cards.length ||
      !modal ||
      !closeBtn ||
      !overlay ||
      !modalPhoto ||
      !modalName ||
      !modalRole ||
      !modalBio
    ) return;

    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    const openModal = (card) => {
      modalPhoto.src = card.dataset.photo || "";
      modalPhoto.alt = card.dataset.name || "";
      modalName.textContent = card.dataset.name || "";
      modalRole.textContent = card.dataset.role || "";
      modalBio.innerHTML = `<p>${(card.dataset.bio || "").replace(/\n/g, "<br>")}</p>`;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest(".team-social")) return;
        openModal(card);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(card);
        }
      });
    });

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initLanguageSwitcher();
    initServiceCards();
    initContactForm();
    initReusableStaggerReveal();
    initBusinessNumbers();
    initTeamModal();
  });

  initPageLoader();
})();


/* =========================================================
   DESK COLLECTION + FIELD COLLECTION
   MERGED JS (NO DOUBLE)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     PAGE LOADER
     ========================= */
  const loader = document.getElementById("page-loader");

  if (loader && !loader.dataset.initialized) {
    loader.dataset.initialized = "true";

    setTimeout(() => {
      loader.classList.add("zoom-out");
    }, 1200);

    setTimeout(() => {
      loader.style.display = "none";
    }, 2100);
  }

  /* =========================
     MOBILE NAVIGATION
     ========================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu =
    document.querySelector(".topnav-menu") ||
    document.querySelector(".nav-menu");

  if (menuToggle && navMenu && !menuToggle.dataset.initialized) {
    menuToggle.dataset.initialized = "true";

    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  /* =========================
     MOBILE DROPDOWN
     ========================= */
  const dropdownItems = document.querySelectorAll(
    ".has-dropdown, .nav-dropdown"
  );

  dropdownItems.forEach((item) => {
    const trigger =
      item.querySelector(":scope > a") ||
      item.querySelector(".dropdown-toggle");

    if (trigger && !trigger.dataset.initialized) {
      trigger.dataset.initialized = "true";

      trigger.addEventListener("click", function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle("submenu-open");
          item.classList.toggle("open");
        }
      });
    }
  });

  /* =========================
     DESK FLOW SCROLL REVEAL
     ========================= */
  const processSection = document.querySelector(".process");

  if (processSection) {
    const processObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processSection.classList.add("active");
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    processObserver.observe(processSection);
  }

  /* =========================
     CARD REVEAL ANIMATION
     ========================= */
  const revealTargets = document.querySelectorAll(
    ".flow-step, .platform-card, .fc-mini-card, .fc-challenge-card, .why-card"
  );

  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show", "is-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealTargets.forEach((item) => {
      revealObserver.observe(item);
    });
  }

  /* =========================
     FLOAT HERO CIRCLE EFFECT
     ========================= */
  const circles = document.querySelectorAll(".circle");

  circles.forEach((circle, index) => {
    circle.style.animationDelay = `${index * 0.3}s`;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const amcFlowV4 = document.getElementById("amcFlowV4");
  if (!amcFlowV4) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        amcFlowV4.classList.add("is-visible");
        observer.unobserve(amcFlowV4);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(amcFlowV4);
});

document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal-pop");
  if (!revealItems.length) return;

  const revealItem = (item, index) => {
    if (item.classList.contains("is-visible")) return;
    item.style.transitionDelay = `${index * 0.25}s`;
    item.classList.add("is-visible");
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const index = Array.from(revealItems).indexOf(item);
        revealItem(item, index);
        obs.unobserve(item);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item, index) => {
    observer.observe(item);

    // fallback kalau saat refresh element sudah kelihatan di viewport
    const rect = item.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.92 &&
      rect.bottom > 0;

    if (inView) {
      revealItem(item, index);
      observer.unobserve(item);
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const network = document.getElementById("teamNetwork");
  if (!network) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        network.classList.add("is-visible");
        observer.unobserve(network);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(network);
});

document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.getElementById("bpoStats");
  if (!statsSection) return;

  const counters = Array.from(statsSection.querySelectorAll(".count-up"));
  if (!counters.length) return;

  const animateCount = (element, target, duration = 1600) => {
    const start = performance.now();
    const from = 0;

    const step = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(from + (target - from) * eased);

      element.textContent = value.toLocaleString("id-ID");

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString("id-ID");
      }
    };

    requestAnimationFrame(step);
  };

  const runStatsAnimation = () => {
    if (statsSection.dataset.animated === "true") return;

    statsSection.dataset.animated = "true";
    statsSection.classList.add("is-animated");

    counters.forEach((counter, index) => {
      const target = Number.parseInt(counter.dataset.target || "0", 10);

      window.setTimeout(() => {
        animateCount(counter, Number.isNaN(target) ? 0 : target, 4000);
      }, index * 250);
    });
  };

  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runStatsAnimation();
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observer.observe(statsSection);

    // fallback: kalau pas refresh section sudah kelihatan
    const rect = statsSection.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.9 &&
      rect.bottom > 0;

    if (inView) {
      runStatsAnimation();
      observer.unobserve(statsSection);
    }
  } else {
    runStatsAnimation();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const jobCards = Array.from(document.querySelectorAll(".career-job-card"));
  const paginationWrap = document.getElementById("careerPagination");

  const ITEMS_PER_PAGE = 4;
  let currentPage = 1;

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    paginationWrap.innerHTML = "";

    if (totalPages <= 1) {
      paginationWrap.style.display = "none";
      return;
    }

    paginationWrap.style.display = "flex";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `career-page-link ${i === currentPage ? "active" : ""}`;
      btn.textContent = i;

      btn.addEventListener("click", () => {
        currentPage = i;
        renderJobs();

        window.scrollTo({
          top: document.querySelector(".career-listing-section")?.offsetTop - 90 || 0,
          behavior: "smooth"
        });
      });

      paginationWrap.appendChild(btn);
    }
  }

  function renderJobs() {
    const totalPages = Math.max(1, Math.ceil(jobCards.length / ITEMS_PER_PAGE));

    if (currentPage > totalPages) {
      currentPage = 1;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const visibleCards = jobCards.slice(start, end);

    jobCards.forEach((card) => {
      card.style.display = "none";
    });

    visibleCards.forEach((card) => {
      card.style.display = "";
    });

    renderPagination(jobCards.length);
  }

  renderJobs();
});