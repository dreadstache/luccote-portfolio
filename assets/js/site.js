
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

function applyFilter(filter, shouldScroll = true) {
  document.querySelectorAll(".filter").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  projectCards.forEach(card => {
    const categories = card.dataset.category.split(" ");
    card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
  });

  if (shouldScroll) document.querySelector("#work")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

filterButtons.forEach(button => {
  if (button.classList.contains("orbit")) {
    const satellites = document.createElement("span");
    satellites.className = "satellites";
    satellites.setAttribute("aria-hidden", "true");
    button.dataset.satellites.split("|").slice(0, 3).forEach((label, index) => {
      const satellite = appendText(satellites, "span", label, `satellite satellite-${index + 1}`);
      satellite.style.setProperty("--satellite-index", index);
    });
    button.append(satellites);
    button.addEventListener("click", () => {
      const next = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".orbit[aria-expanded='true']").forEach(open => open.setAttribute("aria-expanded", "false"));
      button.setAttribute("aria-expanded", String(next));
      applyFilter(button.dataset.filter, false);
    });
  } else {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const careerSource = "https://dreadstache.github.io/careeros/generated/resume/resume.json";

function appendText(parent, tag, value, className) {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function formatPeriod(record) {
  const start = record.start_date || "";
  const end = record.end_date || "Present";
  return start ? `${start} — ${end}` : end;
}

function renderCareer(data) {
  const summary = document.querySelector("#career-summary");
  const experienceRoot = document.querySelector("#career-experience");
  const skillsRoot = document.querySelector("#career-skills");
  if (!summary || !experienceRoot || !skillsRoot) return;

  summary.textContent = data.basics?.summary || "A multidisciplinary career across systems, software, art, and analytics.";
  const activeExperience = (data.experience || []).filter(record => record.status !== "archived");
  activeExperience
    .sort((left, right) => String(right.start_date || "").localeCompare(String(left.start_date || "")))
    .slice(0, 6)
    .forEach(record => {
      const card = document.createElement("article");
      card.className = "career-role";
      const period = appendText(card, "p", formatPeriod(record), "career-period");
      period.setAttribute("aria-label", `Period: ${period.textContent}`);
      appendText(card, "h3", record.position || "Role");
      appendText(card, "p", record.organization || "", "career-organization");
      if (record.summary) appendText(card, "p", record.summary, "career-role-summary");
      experienceRoot.append(card);
    });

  (data.skills || [])
    .filter(group => group.status !== "archived")
    .flatMap(group => group.keywords || [])
    .filter((skill, index, all) => all.indexOf(skill) === index)
    .forEach(skill => appendText(skillsRoot, "span", skill));
}

fetch(careerSource, { headers: { Accept: "application/json" } })
  .then(response => {
    if (!response.ok) throw new Error("CareerOS request failed");
    return response.json();
  })
  .then(renderCareer)
  .catch(() => {
    document.querySelector("#career-summary")?.setAttribute("hidden", "");
    const fallback = document.querySelector("#career-fallback");
    if (fallback) fallback.hidden = false;
  });
