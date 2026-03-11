document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;
  var navToggle = document.querySelector("[data-nav-toggle]");
  var siteNav = document.querySelector("#site-nav");

  if (navToggle && siteNav) {
    function closeNav() {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
      body.classList.remove("menu-open");
    }

    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      siteNav.classList.toggle("is-open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && navToggle.getAttribute("aria-expanded") === "true") {
        closeNav();
      }
    });
  }

  document.querySelectorAll("[data-tabs]").forEach(function (tabsRoot) {
    var buttons = Array.prototype.slice.call(tabsRoot.querySelectorAll("[data-tab-target]"));
    var panels = tabsRoot.querySelectorAll("[data-tab-panel]");

    function activateTab(target, focusTab) {
      buttons.forEach(function (item) {
        var isActive = item.getAttribute("data-tab-target") === target;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.setAttribute("tabindex", isActive ? "0" : "-1");
        if (isActive && focusTab) item.focus();
      });

      panels.forEach(function (panel) {
        var isActive = panel.id === target;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activateTab(button.getAttribute("data-tab-target"), false);
      });

      button.addEventListener("keydown", function (e) {
        var index = buttons.indexOf(button);
        var next = -1;

        if (e.key === "ArrowRight") next = (index + 1) % buttons.length;
        else if (e.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = buttons.length - 1;

        if (next >= 0) {
          e.preventDefault();
          activateTab(buttons[next].getAttribute("data-tab-target"), true);
        }
      });
    });

    // Activate tab matching URL hash on load
    var hash = window.location.hash.replace("#", "");
    if (hash) {
      var matchingPanel = tabsRoot.querySelector("[data-tab-panel]#" + CSS.escape(hash));
      if (matchingPanel) {
        activateTab(hash, false);
      }
    }
  });

  document.querySelectorAll(".faq-item button").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach(function (node) {
        node.classList.remove("is-open");
      });
      document.querySelectorAll(".faq-item button").forEach(function (node) {
        node.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.querySelectorAll("[data-form]").forEach(function (form) {
    var status = form.querySelector("[data-form-status]");
    var requiredFields = form.querySelectorAll("[required]");

    form.addEventListener("submit", function (event) {
      var invalidField = null;

      requiredFields.forEach(function (field) {
        var isValid = field.checkValidity();
        field.setAttribute("aria-invalid", String(!isValid));
        if (!invalidField && !isValid) {
          invalidField = field;
        }
      });

      if (invalidField) {
        event.preventDefault();
        invalidField.focus();

        if (status) {
          status.textContent = "Check the highlighted fields and try again.";
          status.classList.add("is-error");
          status.classList.remove("is-success");
        }

        return;
      }

      event.preventDefault();

      requiredFields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });

      if (status) {
        status.textContent = "Front-end validation passed. Connect this form to your delivery endpoint before launch.";
        status.classList.add("is-success");
        status.classList.remove("is-error");
      }
    });
  });

  // Video modal
  var modalOpen = false;
  document.querySelectorAll(".play-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (modalOpen) return;
      modalOpen = true;

      var overlay = document.createElement("div");
      overlay.className = "video-modal-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Video player");

      var modal = document.createElement("div");
      modal.className = "video-modal";

      var close = document.createElement("button");
      close.type = "button";
      close.className = "video-modal-close";
      close.setAttribute("aria-label", "Close video");
      close.textContent = "\u00D7";

      var placeholder = document.createElement("div");
      placeholder.className = "video-modal-placeholder";
      placeholder.innerHTML = "<p>Video coming soon.</p><p>Check back later for our overview video.</p>";

      modal.appendChild(close);
      modal.appendChild(placeholder);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      close.focus();

      // Focus trap
      var focusable = overlay.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])");
      var firstFocusable = focusable[0];
      var lastFocusable = focusable[focusable.length - 1];

      function trapFocus(e) {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      }

      function closeModal() {
        document.removeEventListener("keydown", handleKeydown);
        overlay.removeEventListener("keydown", trapFocus);
        document.body.removeChild(overlay);
        modalOpen = false;
        btn.focus();
      }

      function handleKeydown(e) {
        if (e.key === "Escape") closeModal();
      }

      close.addEventListener("click", closeModal);
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });
      overlay.addEventListener("keydown", trapFocus);
      document.addEventListener("keydown", handleKeydown);
    });
  });
});
