// PneuScan AI - simple interactions
(function () {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Mobile nav toggle
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("navMenu");
    const links = document.querySelectorAll(".nav-link");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close menu when clicking a link (mobile)
        links.forEach((a) => {
            a.addEventListener("click", () => {
                if (menu.classList.contains("is-open")) {
                    menu.classList.remove("is-open");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        });

        // Close on escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("is-open")) {
                menu.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Scroll reveal
    const revealEls = document.querySelectorAll(".reveal");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealEls.forEach((el) => io.observe(el));

    // Improve anchor scrolling offset (sticky header)
    // Smooth scroll is already set in CSS, but we adjust for header height.
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (!id || id === "#") return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            const header = document.querySelector(".site-header");
            const offset = header ? header.offsetHeight + 10 : 80;

            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });

            history.pushState(null, "", id);
        });
    });
})();