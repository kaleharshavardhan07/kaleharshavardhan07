// Futuristic Portfolio — main.js

(function () {
    "use strict";

    // ─── Theme Toggle ───────────────────────────────
    var themeToggle = document.getElementById("themeToggle");
    var body = document.body;

    function applyTheme(theme) {
        body.className = theme + "-theme";
        if (themeToggle) {
            themeToggle.innerHTML =
                theme === "dark"
                    ? '<i class="fas fa-moon"></i>'
                    : '<i class="fas fa-sun"></i>';
        }
        updateNavbar();
    }

    var saved = localStorage.getItem("portfolioTheme") || "dark";
    applyTheme(saved);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var isLight = body.classList.contains("light-theme");
            var next = isLight ? "dark" : "light";
            applyTheme(next);
            localStorage.setItem("portfolioTheme", next);
        });
    }

    // ─── Mobile Menu ────────────────────────────────
    var mobileBtn = document.getElementById("mobileMenuToggle");
    var navMenu = document.getElementById("navMenu");

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener("click", function () {
            navMenu.classList.toggle("active");
            var spans = mobileBtn.querySelectorAll("span");
            var open = navMenu.classList.contains("active");
            if (spans[0]) spans[0].style.transform = open ? "rotate(45deg) translate(5px,6px)" : "";
            if (spans[1]) spans[1].style.opacity = open ? "0" : "";
            if (spans[2]) spans[2].style.transform = open ? "rotate(-45deg) translate(5px,-7px)" : "";
        });
    }

    // Close mobile menu on nav click
    var navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navMenu) navMenu.classList.remove("active");
            if (mobileBtn) {
                var spans = mobileBtn.querySelectorAll("span");
                spans.forEach(function (s) { s.style.transform = ""; s.style.opacity = ""; });
            }
        });
    });

    // ─── Smooth Scroll ──────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            var target = document.querySelector(a.getAttribute("href"));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 75, behavior: "smooth" });
            }
        });
    });

    // ─── Navbar background on scroll ────────────────
    var navbar = document.getElementById("navbar");

    function updateNavbar() {
        if (!navbar) return;
        var scrolled = window.scrollY > 50;
        var isLight = body.classList.contains("light-theme");
        if (isLight) {
            navbar.style.background = scrolled ? "rgba(240,244,255,0.97)" : "rgba(240,244,255,0.9)";
            navbar.style.boxShadow = scrolled ? "0 2px 24px rgba(0,60,200,0.1)" : "none";
        } else {
            navbar.style.background = scrolled ? "rgba(2,8,23,0.97)" : "rgba(2,8,23,0.9)";
            navbar.style.boxShadow = scrolled ? "0 2px 30px rgba(0,0,0,0.4)" : "none";
        }
    }

    // ─── Active Nav Highlight ───────────────────────
    var sections = document.querySelectorAll("section[id]");

    function updateActiveNav() {
        var scrollPos = window.scrollY + 120;
        sections.forEach(function (sec) {
            var link = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (!link) return;
            if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
                navLinks.forEach(function (l) { l.classList.remove("active"); });
                link.classList.add("active");
            }
        });
    }

    // ─── Scroll Animations ─────────────────────────
    // Uses IntersectionObserver with a generous fallback
    var animSelectors = ".scroll-animate, .scroll-animate-left, .scroll-animate-right";
    var animEls = document.querySelectorAll(animSelectors);

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
        );
        animEls.forEach(function (el, i) {
            el.style.transitionDelay = (i % 5) * 0.08 + "s";
            observer.observe(el);
        });
    } else {
        // No IntersectionObserver support — just show everything
        animEls.forEach(function (el) { el.classList.add("animate"); });
    }

    // SAFETY FALLBACK: force-reveal everything after 2 seconds no matter what
    setTimeout(function () {
        document.querySelectorAll(animSelectors).forEach(function (el) {
            el.classList.add("animate");
        });
    }, 2000);

    // ─── Scroll handler ─────────────────────────────
    var ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function () {
                updateNavbar();
                updateActiveNav();
                ticking = false;
            });
        }
    });

    // ─── Typed Role Effect ──────────────────────────
    var typedEl = document.getElementById("typed-role");
    var roles = [
        "Software Engineer",
        "Backend Developer",
        "Systems Programmer",
        "ML Enthusiast",
        "Full-Stack Developer"
    ];
    var rIdx = 0, cIdx = 0, deleting = false;

    function typeRole() {
        if (!typedEl) return;
        var current = roles[rIdx];
        if (!deleting) {
            typedEl.textContent = current.substring(0, cIdx + 1);
            cIdx++;
            if (cIdx === current.length) {
                deleting = true;
                setTimeout(typeRole, 1800);
                return;
            }
        } else {
            typedEl.textContent = current.substring(0, cIdx - 1);
            cIdx--;
            if (cIdx === 0) {
                deleting = false;
                rIdx = (rIdx + 1) % roles.length;
            }
        }
        setTimeout(typeRole, deleting ? 50 : 90);
    }
    setTimeout(typeRole, 1200);

    // ─── Particles ──────────────────────────────────
    var particleBox = document.getElementById("particles");

    // Inject particle animation keyframe
    var pStyle = document.createElement("style");
    pStyle.textContent =
        "@keyframes particle-rise{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-110vh) rotate(360deg);opacity:0}}";
    document.head.appendChild(pStyle);

    function spawnParticle() {
        if (!particleBox) return;
        var p = document.createElement("div");
        var size = Math.random() * 3 + 1;
        var isLight = body.classList.contains("light-theme");
        var color = isLight
            ? "rgba(0,119,204," + (Math.random() * 0.25 + 0.05) + ")"
            : "rgba(0,212,255," + (Math.random() * 0.4 + 0.1) + ")";
        p.style.cssText =
            "position:absolute;width:" + size + "px;height:" + size + "px;" +
            "background:" + color + ";" +
            "border-radius:50%;left:" + (Math.random() * 100) + "%;" +
            "top:110%;pointer-events:none;" +
            "animation:particle-rise " + (Math.random() * 4 + 4) + "s linear forwards;";
        particleBox.appendChild(p);
        setTimeout(function () { p.remove(); }, 8500);
    }

    setInterval(spawnParticle, 500);

    // ─── Stat Counter Animation ─────────────────────
    if ("IntersectionObserver" in window) {
        var statObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = "1";
                    animateNum(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll(".stat-number, .hero-stat-num").forEach(function (el) {
            statObs.observe(el);
        });
    }

    function animateNum(el) {
        var raw = el.textContent;
        var num = parseFloat(raw.replace(/[^0-9.]/g, ""));
        var suffix = raw.replace(/[0-9.]/g, "");
        if (isNaN(num)) return;
        var isInt = num % 1 === 0;
        var steps = 50, step = 0;
        var interval = setInterval(function () {
            step++;
            var eased = 1 - Math.pow(1 - step / steps, 3);
            var cur = num * eased;
            el.textContent = (isInt ? Math.floor(cur) : cur.toFixed(2)) + suffix;
            if (step >= steps) {
                clearInterval(interval);
                el.textContent = raw;
            }
        }, 25);
    }

    // ─── Init ───────────────────────────────────────
    updateNavbar();
    updateActiveNav();

    console.log(
        "%c🚀 Harshavardhan Kale's Portfolio\n%cSoftware Engineer | COEP Pune | Pine Labs Intern",
        "font-size:16px;font-weight:bold;color:#00d4ff;",
        "font-size:12px;color:#a8c5e8;"
    );
})();
