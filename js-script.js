// =======================
// Service Cards: flip via keyboard
// =======================
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("force-flip");
      card.focus();
    }
    if (e.key === "Escape") {
      card.classList.remove("force-flip");
      card.blur();
    }
  });

  card.addEventListener("blur", () => {
    card.classList.remove("force-flip");
  });
});

// CSS fallback for force flip
(() => {
  const style = document.createElement("style");
  style.textContent = `
    .service-card.force-flip .service-front { transform: rotateY(180deg); }
    .service-card.force-flip .service-back  { transform: rotateY(360deg); }
  `;
  document.head.appendChild(style);
})();

// =======================
// Contact Form: demo submit (no backend)
// =======================
(() => {
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  if (!form || !hint) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const company = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();

    hint.textContent = `Terima kasih, ${company}! Permohonan kamu sudah kami terima. Tim kami akan menghubungi via ${email}.`;
    form.reset();
    hint.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();

// =======================
// Business in Numbers: line + counting animation
// =======================
(() => {
  const section = document.querySelector("#numbers");
  if (!section) return;

  const rows = Array.from(section.querySelectorAll(".biznum-row"));

  function animateCount(el, target, duration = 1400) {
    const start = performance.now();
    const from = 0;

    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;

      rows.forEach((row, idx) => {
        setTimeout(() => {
          row.classList.add("is-animate");
          const counter = row.querySelector(".biznum-counter");
          if (!counter || counter.dataset.done === "1") return;

          counter.dataset.done = "1";
          const target = parseInt(row.dataset.target || "0", 10);
          animateCount(counter, target);
        }, idx * 180);
      });

      obs.disconnect();
    }
  }, { threshold: 0.25 });

  io.observe(section);
})();

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".team-card.premium");
  const modal = document.getElementById("teamModal");
  const closeBtn = document.getElementById("teamModalClose");
  const overlay = document.querySelector(".team-modal-overlay");
  const modalPhoto = document.getElementById("teamModalPhoto");
  const modalName = document.getElementById("teamModalName");
  const modalRole = document.getElementById("teamModalRole");
  const modalBio = document.getElementById("teamModalBio");

  if (!cards.length || !modal || !closeBtn || !overlay || !modalPhoto || !modalName || !modalRole || !modalBio) {
    console.log("Team modal element not found");
    return;
  }

  function openModal(card) {
    modalPhoto.src = card.dataset.photo || "";
    modalPhoto.alt = card.dataset.name || "";
    modalName.textContent = card.dataset.name || "";
    modalRole.textContent = card.dataset.role || "";
    modalBio.innerHTML = `<p>${card.dataset.bio || ""}</p>`;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".team-social")) return;
      openModal(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});

// =======================
// Language Switcher
// =======================
(() => {
  const switcher = document.getElementById("langSwitcher");
  const trigger = document.getElementById("langTrigger");

  if (!switcher || !trigger) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    switcher.classList.toggle("open");
    const expanded = switcher.classList.contains("open");
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      switcher.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
})();

