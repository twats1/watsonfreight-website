(() => {
  const MOBILE_BREAKPOINT = 900;

  function initializeHeader(header) {
    if (header.dataset.enhanced === "true") return;
    header.dataset.enhanced = "true";

    const navigation = header.querySelector("nav");
    if (!navigation) return;

    navigation.id ||= "main-navigation";

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "mobile-menu-button";
    menuButton.setAttribute("aria-controls", navigation.id);
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.innerHTML = "<span></span><span></span><span></span>";

    Object.assign(menuButton.style, {
      width: "44px",
      height: "44px",
      padding: "10px",
      border: "1px solid rgba(255,255,255,.35)",
      borderRadius: "8px",
      color: "white",
      background: "transparent",
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "5px",
    });

    menuButton.querySelectorAll("span").forEach((line) => {
      Object.assign(line.style, {
        display: "block",
        width: "22px",
        height: "2px",
        background: "currentColor",
        transition: "transform .2s ease, opacity .2s ease",
      });
    });

    header.insertBefore(menuButton, header.querySelector(".header-quote"));

    function closeMenu() {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.removeAttribute("style");
      document.body.style.overflow = "";
    }

    function openMenu() {
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation menu");
      Object.assign(navigation.style, {
        position: "absolute",
        top: "100%",
        right: "0",
        left: "0",
        display: "grid",
        justifyContent: "stretch",
        gap: "0",
        padding: "12px 20px 22px",
        background: "#081521",
        boxShadow: "0 18px 30px rgba(0,0,0,.25)",
      });
      navigation.querySelectorAll("a").forEach((link) => {
        Object.assign(link.style, {
          padding: "16px 4px",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        });
      });
    }

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu(); else openMenu();
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a") && window.innerWidth <= MOBILE_BREAKPOINT) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
    });

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
      header.style.minHeight = window.scrollY > 40 ? "78px" : "";
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  function initialize() {
    document.querySelectorAll(".site-header").forEach(initializeHeader);

    document.querySelectorAll(".copyright").forEach((copyright) => {
      copyright.textContent = copyright.textContent.replace(/©\s+\d{4}/, `© ${new Date().getFullYear()}`);
    });

    const responsiveRule = document.createElement("style");
    responsiveRule.textContent = `
      .mobile-menu-button { display: none !important; }
      @media (max-width: ${MOBILE_BREAKPOINT}px) {
        .mobile-menu-button { display: flex !important; }
        .site-header { grid-template-columns: 1fr auto auto; gap: 10px; }
      }
      @media (max-width: 520px) {
        .site-header .header-quote { display: none; }
        .site-header { grid-template-columns: 1fr auto; }
      }
    `;
    document.head.appendChild(responsiveRule);
  }

  function startAfterHydration() {
    window.setTimeout(initialize, 350);
  }

  if (document.readyState === "complete") {
    startAfterHydration();
  } else {
    window.addEventListener("load", startAfterHydration, { once: true });
  }
})();
