
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
      if (button.dataset.link) {
        window.location.href = button.dataset.link;
        return;
      }
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
const resumeTrackSource = "https://dreadstache.github.io/careeros/generated/resume/tracks.json";
const ecosystemSource = "https://dreadstache.github.io/careeros/generated/ecosystem.json";
const fallbackDestinations = [
  { id: "tech", label: "Tech & Systems", description: "Analytics, GIS, software, and automation.", url: "https://dreadstache.github.io/luccote-portfolio/", status: "live" },
  { id: "three-d", label: "Games, Film & 3D", description: "Interactive models and technical art.", url: "https://dreadstache.github.io/dreadstache-portfolio/", status: "live" },
  { id: "music", label: "Music", description: "Dreadstache releases and production.", url: "https://dreadstache.com/", status: "live" },
  { id: "resumes", label: "Résumé Library", description: "Focused, verified career stories.", url: "https://dreadstache.github.io/careeros/generated/resume/", status: "live" },
];
const resumeTrackLabels = {
  analytics: "Primary Track",
  gis: "Spatial Track",
  "game-development": "Game Track",
  "technical-art": "Art & Pipeline Track",
  "software-systems": "Systems Track",
  "music-production": "Music Track",
  "web-development": "Web Track",
};

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

function renderResumeTracks(manifest) {
  const resumeGrid = document.querySelector(".resume-grid");
  if (!resumeGrid || !Array.isArray(manifest.tracks) || manifest.tracks.length === 0) return;

  const cards = manifest.tracks.map(track => {
    if (!track.slug || !track.title) return null;
    const card = document.createElement("article");
    card.className = `resume-card${track.slug === "game-development" ? " featured-resume" : ""}`;
    const content = document.createElement("div");
    appendText(content, "p", resumeTrackLabels[track.slug] || "Focused Track", "card-kicker");
    appendText(content, "h3", track.title.replace(/\s+R[eé]sum[eé]$/i, ""));
    appendText(content, "p", track.summary || track.headline || "A focused view of verified career experience.");
    const link = appendText(card, "a", "View live résumé", "button primary");
    link.href = `https://dreadstache.github.io/careeros/generated/resume/${encodeURIComponent(track.slug)}/index.html`;
    card.prepend(content);
    return card;
  }).filter(Boolean);

  if (cards.length > 0) resumeGrid.replaceChildren(...cards);
}

function renderWorkSwitcher(manifest) {
  let switcher = document.querySelector(".work-switcher");
  if (!switcher) {
    const header = document.querySelector(".site-header");
    if (!header) return;
    switcher = document.createElement("details");
    switcher.className = "work-switcher";
    switcher.dataset.currentDestination = "tech";
    const summary = appendText(switcher, "summary", "Explore work ");
    appendText(summary, "span", "▾").setAttribute("aria-hidden", "true");
    const menu = document.createElement("div");
    menu.className = "work-switcher-menu";
    const intro = document.createElement("p");
    appendText(intro, "strong", "Luc Cote");
    appendText(intro, "span", "One practice, several ways in.");
    menu.append(intro);
    const links = document.createElement("div");
    links.className = "work-switcher-links";
    menu.append(links);
    switcher.append(menu);
    header.append(switcher);
  }
  const linkRoot = switcher?.querySelector(".work-switcher-links");
  if (!switcher || !linkRoot || !Array.isArray(manifest.destinations)) return;
  const currentDestination = switcher.dataset.currentDestination;
  const links = manifest.destinations
    .filter(destination => destination.status === "live" && destination.url)
    .map(destination => {
      const link = document.createElement("a");
      link.href = destination.url;
      if (destination.id === currentDestination) link.setAttribute("aria-current", "page");
      appendText(link, "strong", destination.label || destination.id);
      appendText(link, "span", destination.description || "Explore this portfolio.");
      return link;
    });
  if (links.length > 0) linkRoot.replaceChildren(...links);
}

renderWorkSwitcher({ destinations: fallbackDestinations });

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

fetch(resumeTrackSource, { cache: "no-store", headers: { Accept: "application/json" } })
  .then(response => {
    if (!response.ok) throw new Error("CareerOS track request failed");
    return response.json();
  })
  .then(renderResumeTracks)
  .catch(() => undefined);

fetch(ecosystemSource, { cache: "no-store", headers: { Accept: "application/json" } })
  .then(response => {
    if (!response.ok) throw new Error("CareerOS ecosystem request failed");
    return response.json();
  })
  .then(renderWorkSwitcher)
  .catch(() => undefined);
