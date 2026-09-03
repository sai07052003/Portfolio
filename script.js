const navbar = document.querySelector("#navbar");
const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.querySelector("#backToTop");
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");

const setNavbarState = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  menuToggle.classList.remove("open");
  mobileMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("open");
  mobileMenu.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
  revealObserver.observe(element);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const subject = String(data.get("subject") || "").trim();
  const message = String(data.get("message") || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  formMessage.classList.remove("error");

  if (!name || !email || !subject || !message) {
    formMessage.textContent = "Please complete all fields before submitting.";
    formMessage.classList.add("error");
    return;
  }

  if (!emailPattern.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.classList.add("error");
    return;
  }

  formMessage.textContent = "Thanks. Your message is ready to send once a backend is connected.";
  contactForm.reset();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", setNavbarState, { passive: true });
setNavbarState();
