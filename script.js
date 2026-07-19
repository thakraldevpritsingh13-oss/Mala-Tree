/* ======================================================
   MALA TREE — SCRIPT.JS
   Vanilla JS only. Organized by feature.
   ====================================================== */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "917681915216"; // country code + number, no + or spaces

  /* ---------- Sticky header on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  document.addEventListener("DOMContentLoaded", onScrollHeader);
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.classList.toggle("is-active", isOpen);
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal (fade + slide up) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // slight stagger for elements revealed in the same batch
            var delay = Math.min(i * 60, 240);
            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Mala scroll-progress thread (signature element) ---------- */
  var malaFill = document.getElementById("malaFill");
  var malaGuru = document.getElementById("malaGuru");
  var malaBeads = document.querySelectorAll(".mala-bead");
  function updateMalaThread() {
    if (!malaFill) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    var pct = progress * 100;
    malaFill.style.height = pct + "%";
    if (malaGuru) malaGuru.style.top = pct + "%";
    malaBeads.forEach(function (bead) {
      var step = parseFloat(bead.getAttribute("data-step")); // 0..6
      var beadPct = (step / 6) * 100;
      if (pct >= beadPct - 1) {
        bead.classList.add("is-passed");
      } else {
        bead.classList.remove("is-passed");
      }
    });
  }
  window.addEventListener("scroll", updateMalaThread, { passive: true });
  window.addEventListener("resize", updateMalaThread);
  document.addEventListener("DOMContentLoaded", updateMalaThread);

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById("backToTop");
  function onScrollBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 600) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", onScrollBackToTop, { passive: true });
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var accordion = document.getElementById("accordion");
  if (accordion) {
    var triggers = accordion.querySelectorAll(".accordion__trigger");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion__item");
        var panel = item.querySelector(".accordion__panel");
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        // close all others
        triggers.forEach(function (t) {
          if (t !== trigger) {
            t.setAttribute("aria-expanded", "false");
            t.closest(".accordion__item").querySelector(".accordion__panel").style.maxHeight = null;
          }
        });

        if (isOpen) {
          trigger.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = null;
        } else {
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------- Testimonial track: mouse / touch drag-scroll ---------- */
  var track = document.getElementById("testiTrack");
  if (track) {
    var isDown = false;
    var startX, scrollLeft;
    track.addEventListener("mousedown", function (e) {
      isDown = true;
      track.classList.add("is-dragging");
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    ["mouseleave", "mouseup"].forEach(function (evt) {
      track.addEventListener(evt, function () {
        isDown = false;
        track.classList.remove("is-dragging");
      });
    });
    track.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* ---------- Contact form -> WhatsApp handoff ---------- */
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("cf-name").value.trim();
      var contact = document.getElementById("cf-contact").value.trim();
      var interest = document.getElementById("cf-interest").value;
      var message = document.getElementById("cf-message").value.trim();

      if (!name || !contact || !message) {
        formStatus.textContent = "Please fill in your name, contact info and message.";
        formStatus.style.color = "#A54F2B";
        return;
      }

      var text =
        "Namaste, I'm " + name + ".\n" +
        "Interested in: " + interest + "\n" +
        "Message: " + message + "\n" +
        "You can reach me at: " + contact;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

      formStatus.textContent = "Opening WhatsApp with your message ready to send…";
      formStatus.style.color = "#6E7F63";

      window.open(url, "_blank", "noopener");
      contactForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
