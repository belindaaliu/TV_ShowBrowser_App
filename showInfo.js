const container = document.getElementById("showDetails");
const baseUrl = "https://api.tvmaze.com";

const params = new URLSearchParams(window.location.search);
const showId = params.get("id");

fetch(`${baseUrl}/shows/${showId}`)
  .then(res => res.json())
  .then(show => {
    container.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${show.image?.original || show.image?.medium}" class="img-fluid rounded mb-3" alt="${show.name}">
                <a href="#" class="btn btn-primary w-100 mb-2 favorite">🤍 Follow</a>
            </div>
            <div class="col-md-8">
                <h1>${show.name}</h1>
                <div id="showSummary"></div> <!-- placeholder for summary -->
                <div class="card p-3 mt-3">
                    <h5>Show Info</h5>
                    <p><strong>Web Channel:</strong> ${show.webChannel?.name || 'N/A'}</p>
                    <p><strong>Status:</strong> ${show.status}</p>
                    <p><strong>Type:</strong> ${show.type}</p>
                    <p><strong>Genres:</strong> ${show.genres.join(' | ')}</p>
                    <p><strong>Language:</strong> ${show.language}</p>
                    <p><strong>Runtime:</strong> ${show.runtime} mins</p>
                    <p><strong>Rating:</strong> ⭐ ${show.rating?.average || 'N/A'}</p>
                    <p><strong>Official Site:</strong> <a href="${show.officialSite}" target="_blank">${show.officialSite}</a></p>
                </div>
            </div>
        </div>`;
        document.querySelectorAll(".favorite").forEach(icon => {
            icon.addEventListener("click", () => {
                icon.textContent = icon.textContent === "🤍 Follow" ? "❤️ Following" : "🤍 Follow";
            });
        });
        const summaryDiv = document.getElementById("showSummary");
        summaryDiv.innerHTML = show.summary || "<em>No summary available.</em>";
  });

fetch(`${baseUrl}/shows/${showId}/episodes`)
  .then(res => res.json())
  .then(episodes => {
    const episodeList = episodes.map(ep => `
      <div><strong>S${ep.season}E${ep.number}:</strong> ${ep.name} <em>(${ep.airdate})</em></div>
    `).join('');
    document.getElementById("episodes").innerHTML = episodeList || "No episodes available.";
  });

fetch(`${baseUrl}/shows/${showId}/cast`)
  .then(res => res.json())
  .then(cast => {
    const castList = cast.map(entry => `
      <div><strong>${entry.person.name}</strong> as ${entry.character.name}</div>
    `).join('');
    document.getElementById("cast").innerHTML = castList || "No cast info available.";
  });

fetch(`${baseUrl}/shows/${showId}/seasons`)
  .then(res => res.json())
  .then(seasons => {
    const seasonList = seasons.map(s => `
      <div><strong>Season ${s.number}</strong> (${s.premiereDate} to ${s.endDate})</div>
    `).join('');
    document.getElementById("seasons").innerHTML = seasonList || "No seasons available.";
  });

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!searchForm.checkValidity()) {
    e.stopPropagation();
  }

  searchForm.classList.add("was-validated");

  const query = searchInput.value.trim();
  if (!query) return;

  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
});

