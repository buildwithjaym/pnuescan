(function () {
    // Footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Mobile nav
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("navMenu");
    const links = document.querySelectorAll(".nav-link");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        links.forEach((a) => {
            a.addEventListener("click", () => {
                if (menu.classList.contains("is-open")) {
                    menu.classList.remove("is-open");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menu.classList.contains("is-open")) {
                menu.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Smooth anchor scroll with header offset
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

    // Scroll reveal
    const revealEls = document.querySelectorAll(".reveal");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
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
    } else {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // Counters
    const counterWraps = document.querySelectorAll("[data-counters]");
    const animateCount = (el, to) => {
        const duration = 900;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const val = Math.round(to * eased);
            el.textContent = String(val);
            if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    counterWraps.forEach((wrap) => {
        const statNums = wrap.querySelectorAll("[data-count]");
        let fired = false;

        const counterIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !fired) {
                        fired = true;
                        statNums.forEach((n) => {
                            const to = parseInt(n.getAttribute("data-count"), 10) || 0;
                            animateCount(n, to);
                        });
                        counterIO.disconnect();
                    }
                });
            },
            { threshold: 0.35 }
        );

        counterIO.observe(wrap);
    });

    // Interactive risk simulator
    const range = document.getElementById("riskRange");
    const label = document.getElementById("riskLabel");
    const pct = document.getElementById("riskPct");
    const bar = document.getElementById("riskBar");
    const note = document.getElementById("riskNote");

    function setRisk(v) {
        const value = Math.max(1, Math.min(100, v));
        if (pct) pct.textContent = value + "%";
        if (bar) bar.style.width = value + "%";

        if (!label || !note) return;

        if (value <= 33) {
            label.textContent = "Low";
            note.textContent = "Low risk suggests routine follow-up based on clinical criteria.";
        } else if (value <= 66) {
            label.textContent = "Moderate";
            note.textContent = "Moderate risk suggests closer follow-up based on clinical criteria.";
        } else {
            label.textContent = "Elevated";
            note.textContent = "Elevated risk suggests prioritized screening discussion and possible CT referral based on clinical criteria.";
        }
    }

    if (range) {
        setRisk(parseInt(range.value, 10));
        range.addEventListener("input", (e) => setRisk(parseInt(e.target.value, 10)));
    }

    // Interactive How it works step focus
    const stepsWrap = document.getElementById("steps");
    const howCallout = document.getElementById("howCallout");

    if (stepsWrap) {
        stepsWrap.addEventListener("click", (e) => {
            const btn = e.target.closest(".step-btn");
            if (!btn) return;

            stepsWrap.querySelectorAll(".step-btn").forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            const step = btn.getAttribute("data-step");
            if (!howCallout) return;

            if (step === "1") {
                howCallout.innerHTML = "<strong>Tip:</strong> X-ray input can come from existing workflows or secure upload for pilots.";
            } else if (step === "2") {
                howCallout.innerHTML = "<strong>Tip:</strong> Model output is risk stratification designed to support screening prioritization.";
            } else {
                howCallout.innerHTML = "<strong>Tip:</strong> Reports are designed to be readable and reviewable by clinicians.";
            }
        });
    }
    // Team card focus interaction (optional)
    const teamCards = document.querySelectorAll(".team-card");
    if (teamCards.length) {
        teamCards.forEach((card) => {
            card.addEventListener("click", () => {
                teamCards.forEach((c) => c.classList.remove("is-selected"));
                card.classList.add("is-selected");
            });
        });
    }
    // CTA micro interaction
    const ctaBtn = document.getElementById("ctaBtn");
    const ctaHint = document.getElementById("ctaHint");
    const email = document.getElementById("email");

    if (ctaBtn && ctaHint && email) {
        ctaBtn.addEventListener("click", () => {
            const val = String(email.value || "").trim();
            if (!val || !val.includes("@")) {
                ctaHint.textContent = "Please enter a valid email so we can send the demo deck.";
                return;
            }
            ctaHint.textContent = "Thanks. We will reach out soon with the demo deck and pilot steps.";
            email.value = "";
        });
    }
})();