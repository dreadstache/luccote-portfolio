
const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("careeros-theme");

if (savedTheme) {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.dataset.theme = "light";
}

themeButton?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  localStorage.setItem("careeros-theme", nextTheme);
});

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");

function applyFilter(filter) {
  document.querySelectorAll(".filter").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  projectCards.forEach(card => {
    const categories = card.dataset.category.split(" ");
    card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
  });

  document.querySelector("#work")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

document.querySelector("#year").textContent = new Date().getFullYear();
