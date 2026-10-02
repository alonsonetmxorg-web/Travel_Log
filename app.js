(function () {
  const TZ = "Europe/Berlin";
  const preview = new URLSearchParams(location.search).has("preview"); // ?preview shows every day (for you, not her)

  // Today's date in Berlin as YYYY-MM-DD, so days flip at Berlin midnight.
  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  const toUTC = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const DAY_MS = 86400000;

  const daysSinceStart = Math.round((toUTC(todayStr) - toUTC(CONFIG.startDate)) / DAY_MS);
  const currentDay = daysSinceStart + 1; // 1 on start date
  const unlockedUpTo = preview ? CONFIG.totalDays : Math.min(currentDay, CONFIG.totalDays);

  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const dateOf = (n) => fmt.format(new Date(toUTC(CONFIG.startDate) + (n - 1) * DAY_MS));

  // ── Status pill ───────────────────────────
  const status = document.getElementById("status");
  if (preview) status.textContent = "Preview mode — all days visible";
  else if (currentDay < 1) {
    const n = 1 - currentDay;
    status.textContent = n === 1 ? "The first door opens tomorrow" : `The first door opens in ${n} days`;
  } else if (currentDay <= CONFIG.totalDays) status.textContent = `Day ${currentDay} of ${CONFIG.totalDays} — a new one is open`;
  else status.textContent = "I'm home. Come here.";

  // ── Grid ──────────────────────────────────
  const grid = document.getElementById("grid");
  for (let n = 1; n <= CONFIG.totalDays; n++) {
    const open = n <= unlockedUpTo;
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "day " + (open ? "open" : "locked") + (n === currentDay && !preview ? " today" : "");
    btn.innerHTML = `
      <span class="icon">${open ? "✉️" : "🔒"}</span>
      <span>
        <span class="num">${n}</span><br>
        <span class="date">${dateOf(n)}</span>
      </span>`;
    btn.setAttribute("aria-label", `Day ${n}, ${dateOf(n)}${open ? "" : ", locked"}`);
    if (open) btn.addEventListener("click", () => showDay(n));
    else btn.disabled = true;
    li.appendChild(btn);
    grid.appendChild(li);
  }

  // ── Day dialog ────────────────────────────
  const dialog = document.getElementById("day-dialog");
  const content = document.getElementById("day-content");
  document.getElementById("close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { content.innerHTML = ""; }); // stops audio/embeds

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function songEmbed(url) {
    let m = url.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
    if (m) return `<iframe src="https://open.spotify.com/embed/${m[1]}/${m[2]}" height="152" allow="encrypted-media" loading="lazy"></iframe>`;
    m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    if (m) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" style="aspect-ratio:16/9;height:auto" allowfullscreen loading="lazy"></iframe>`;
    return `<p><a href="${esc(url)}" target="_blank" rel="noopener">🎵 Today's song</a></p>`;
  }

  function mapEmbed(v) {
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(v.trim())) {
      const q = encodeURIComponent(v.replace(/\s/g, ""));
      return `<iframe src="https://maps.google.com/maps?q=${q}&z=12&output=embed" height="300" loading="lazy"></iframe>`;
    }
    return `<p><a href="${esc(v)}" target="_blank" rel="noopener">📍 Where I am today</a></p>`;
  }

  function showDay(n) {
    const d = DAYS[n - 1] || {};
    const hasContent = d.note || d.photo || d.audio || d.song || d.map;
    let html = `<h3>${esc(d.title || "Day " + n)}</h3><p class="meta">Day ${n} · ${dateOf(n)}</p>`;
    if (!hasContent) {
      html += `<p class="placeholder">Something is on its way here… 🐆<br>come back soon.</p>`;
    } else {
      if (d.photo) html += `<figure><img src="${esc(d.photo)}" alt="${esc(d.caption || "Photo for day " + n)}">${d.caption ? `<figcaption>${esc(d.caption)}</figcaption>` : ""}</figure>`;
      if (d.note) html += `<p class="note">${esc(d.note)}</p>`;
      if (d.audio) html += `<audio controls preload="none" src="${esc(d.audio)}"></audio>`;
      if (d.song) html += songEmbed(d.song);
      if (d.map) html += mapEmbed(d.map);
    }
    content.innerHTML = html;
    dialog.showModal();
  }
})();
