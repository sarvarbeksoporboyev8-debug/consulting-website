window.addEventListener("load", function () {
  if (typeof AOS !== "undefined") {
    // Auto-apply staggered zoom-in to gallery items
    document.querySelectorAll(".gallery-item").forEach(function (el, i) {
      el.setAttribute("data-aos", "zoom-in");
      el.setAttribute("data-aos-delay", String((i % 4) * 80));
    });
    AOS.init({ once: false, duration: 650, easing: "ease-out-cubic", offset: 60 });
  }
});

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

    // Close nav when clicking non-dropdown links
    siteNav.querySelectorAll("a").forEach(function (link) {
      if (!link.classList.contains("nav-dropdown-toggle")) {
        link.addEventListener("click", closeNav);
      }
    });

    // Mobile dropdown toggle (tap to expand/collapse)
    siteNav.querySelectorAll(".nav-dropdown-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          var dropdown = toggle.closest(".nav-dropdown");
          var wasOpen = dropdown.classList.contains("is-open");
          // Close all other dropdowns
          siteNav.querySelectorAll(".nav-dropdown").forEach(function (d) {
            d.classList.remove("is-open");
          });
          if (!wasOpen) {
            dropdown.classList.add("is-open");
          }
        }
      });
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

  // Form submission via AJAX
  document.querySelectorAll("[data-form]").forEach(function (form) {
    var status = form.querySelector("[data-form-status]");
    var requiredFields = form.querySelectorAll("[required]");
    var submitBtn = form.querySelector("[type='submit']");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var invalidField = null;

      requiredFields.forEach(function (field) {
        var isValid = field.checkValidity();
        field.setAttribute("aria-invalid", String(!isValid));
        if (!invalidField && !isValid) {
          invalidField = field;
        }
      });

      if (invalidField) {
        invalidField.focus();

        if (status) {
          status.textContent = status.getAttribute("data-msg-error") || "Please check the highlighted fields.";
          status.classList.add("is-error");
          status.classList.remove("is-success");
        }

        return;
      }

      // If no action URL, skip submission
      var action = form.getAttribute("action");
      if (!action) return;

      // Disable button during submission
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      var formData = new FormData(form);

      fetch(action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      }).then(function (response) {
        if (response.ok) {
          if (status) {
            status.textContent = status.getAttribute("data-msg-success") || "Message sent successfully!";
            status.classList.add("is-success");
            status.classList.remove("is-error");
          }

          requiredFields.forEach(function (field) {
            field.removeAttribute("aria-invalid");
          });

          form.reset();
        } else {
          if (status) {
            status.textContent = status.getAttribute("data-msg-error") || "Something went wrong. Please try again.";
            status.classList.add("is-error");
            status.classList.remove("is-success");
          }
        }
      }).catch(function () {
        if (status) {
          status.textContent = status.getAttribute("data-msg-error") || "Network error. Please try again.";
          status.classList.add("is-error");
          status.classList.remove("is-success");
        }
      }).finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      });
    });
  });
});
