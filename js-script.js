// ======================================================
// Greatinco shared frontend script
// - Page loader
// - Mobile menu
// - Language switcher
// - Service card keyboard flip
// - Team modal
// - Contact form submit
// - Business numbers counter
// - Process section reveal
// ======================================================

(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initLoader() {
    const loader = qs("#page-loader");
    if (!loader) return;

    window.addEventListener("load", () => {
      window.setTimeout(() => loader.classList.add("zoom-out"), 1500);
      window.setTimeout(() => {
        loader.style.display = "none";
      }, 2600);
    }, { once: true });
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
    if (!switcher || !trigger) return;

    const closeSwitcher = () => {
      switcher.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      switcher.classList.toggle("open");
      trigger.setAttribute("aria-expanded", switcher.classList.contains("open") ? "true" : "false");
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

  function initTeamModal() {
    const cards = qsa(".team-card.premium");
    const modal = qs("#teamModal");
    const closeBtn = qs("#teamModalClose");
    const overlay = qs(".team-modal-overlay");
    const modalPhoto = qs("#teamModalPhoto");
    const modalName = qs("#teamModalName");
    const modalRole = qs("#teamModalRole");
    const modalBio = qs("#teamModalBio");

    if (!cards.length || !modal || !closeBtn || !overlay || !modalPhoto || !modalName || !modalRole || !modalBio) return;

    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    const openModal = (card) => {
      modalPhoto.src = card.dataset.photo || "";
      modalPhoto.alt = card.dataset.name || "";
      modalName.textContent = card.dataset.name || "";
      modalRole.textContent = card.dataset.role || "";
      modalBio.innerHTML = `<p>${card.dataset.bio || ""}</p>`;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest(".team-social")) return;
        openModal(card);
      });
    });

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  function initContactForm() {
    const form = qs("#contactForm");
    const hint = qs("#formHint");
    const submitBtn = qs("#submitBtn");
    if (!form || !hint || !submitBtn) return;

    const defaultLabel = submitBtn.textContent.trim() || "Kirim Permohonan";
    const loadingLabel = submitBtn.dataset.loadingText || "Mengirim...";
    const successMessage = form.dataset.successMessage || "Terima kasih! Tim kami akan segera menghubungi Anda.";
    const apiUrl = form.getAttribute("action") || form.dataset.apiUrl || "/api/contact";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      hint.textContent = "";
      hint.style.color = "";
      submitBtn.disabled = true;
      submitBtn.textContent = loadingLabel;

      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        let result = null;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const text = await response.text();
          result = text ? { message: text } : null;
        }

        if (!response.ok) {
          throw new Error(result?.message || "Gagal mengirim formulir.");
        }

        hint.textContent = result?.message || successMessage;
        hint.style.color = "green";
        form.reset();
      } catch (error) {
        hint.textContent = error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
        hint.style.color = "red";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
    });
  }

  function initBusinessNumbers() {
    const section = qs("#numbers");
    if (!section || typeof IntersectionObserver === "undefined") return;

    const rows = qsa(".biznum-row", section);
    if (!rows.length) return;

    const animateCount = (element, target, duration = 1400) => {
      const start = performance.now();
      const step = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.floor(target * eased));
        if (progress < 1) requestAnimationFrame(step);
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

  function initProcessReveal() {
    const sections = qsa(".process");
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    sections.forEach((section) => observer.observe(section));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initMobileMenu();
    initLanguageSwitcher();
    initServiceCards();
    initTeamModal();
    initContactForm();
    initBusinessNumbers();
    initProcessReveal();
  });
})();
