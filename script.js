const gallery = document.getElementById("showsGallery");
const baseUrl = "https://api.tvmaze.com";
const pageLabel = document.getElementById("pageNumber");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let allShows = [];
let currentPage = 1;
const showsPerPage = 20;

function renderShows(page) {
  gallery.innerHTML = "";
  const start = (page - 1) * showsPerPage;
  const end = page * showsPerPage;
  const currentShows = allShows.slice(start, end);

  currentShows.forEach(show => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-custom mb-4";
    col.innerHTML = `<div class="card h-100 d-flex flex-column">
                        <a href="showInfo.html?id=${show.id}" target="_blank">
                          <img src="${show.image?.medium || ''}" class="gallery-img card-img-top" alt="${show.name}"/>
                        </a>
                        <div class="card-body d-flex flex-column justify-content-between bg-primary-subtle text-info-emphasis">
                          <a href="show.html?id=${show.id}" target="_blank" class="text-decoration-none">
                            <h5 class="card-title">${show.name}</h5>
                          </a>
                          <hr class="border border-primary border-1">
                          <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-outline-danger btn-sm">
                              <i class="favorite">🤍</i>
                            </button>
                            <span class="text-warning"><i>⭐</i> ${show.rating?.average || 'N/A'}</span>
                          </div>
                        </div>
                      </div>`;
    gallery.appendChild(col);
  });

  document.querySelectorAll(".favorite").forEach(icon => {
    icon.addEventListener("click", () => {
      icon.textContent = icon.textContent === "🤍" ? "❤️" : "🤍";
    });
  });

  pageLabel.textContent = `Page ${currentPage}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = end >= allShows.length;
}

fetch(`${baseUrl}/shows?page=1`)
  .then(res => res.json())
  .then(data => {
    allShows = data;
    renderShows(currentPage);
  });

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderShows(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage * showsPerPage < allShows.length) {
    currentPage++;
    renderShows(currentPage);
  }
});

async function fetchAllShows() {
  let page = 0;
  let done = false;

  while (!done) {
    const res = await fetch(`${baseUrl}/shows?page=${page}`);
    const data = await res.json();
    if (data.length === 0) {
      done = true;
    } else {
      allShows = allShows.concat(data);
      page++;
    }
  }

  renderShows(currentPage);
}
fetchAllShows()

const showStatus = document.getElementById("showStatus");
const showType = document.getElementById("showType");
const genre = document.getElementById("genre");

async function populateFilters() {
  const statusSet = new Set();
  const typeSet = new Set();
  const genreSet = new Set();
  const languageSet = new Set();
  const countrySet = new Set();
  const networkSet = new Set();
  const webChannelSet = new Set();
  const ratingSet = new Set();
  const runtimeSet = new Set();

  for (let i = 0; i < 100; i++) {
    const res = await fetch(`${baseUrl}/shows?page=${i}`);
    const data = await res.json();

    data.forEach(show => {
      if (show.status) statusSet.add(show.status);
      if (show.type) typeSet.add(show.type);
      if (show.genres) show.genres.forEach(g => genreSet.add(g));
      if (show.language) languageSet.add(show.language);
      if (show.network?.country?.name) countrySet.add(show.network.country.name);
      if (show.network?.name) networkSet.add(show.network.name);
      if (show.webChannel?.name) webChannelSet.add(show.webChannel.name);
      if (show.rating?.average) ratingSet.add(Math.floor(show.rating.average));
      if (show.runtime) runtimeSet.add(show.runtime);
    });
  }

  fillSelect(showStatus, statusSet);
  fillSelect(showType, typeSet);
  fillSelect(genre, genreSet);
  fillSelect(document.getElementById("language"), languageSet);
  fillSelect(document.getElementById("country"), countrySet);
  fillSelect(document.getElementById("network"), networkSet);
  fillSelect(document.getElementById("webChannel"), webChannelSet);
  fillSelect(document.getElementById("rating"), [...ratingSet].sort((a, b) => b - a));
  fillSelect(document.getElementById("runtime"), [...runtimeSet].sort((a, b) => a - b));
}

function fillSelect(selectElement, values) {
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

populateFilters();

function renderFiltered(shows) {
  gallery.innerHTML = "";

  const start = (currentPage - 1) * showsPerPage;
  const end = currentPage * showsPerPage;
  const currentShows = shows.slice(start, end);

  currentShows.forEach(show => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-custom mb-4";
    col.innerHTML = `
      <div class="card h-100 d-flex flex-column">
        <a href="showInfo.html?id=${show.id}" target="_blank">
          <img src="${show.image?.medium || ''}" class="gallery-img card-img-top" alt="${show.name}"/>
        </a>
        <div class="card-body d-flex flex-column justify-content-between bg-info-subtle text-info-emphasis">
          <a href="show.html?id=${show.id}" target="_blank" class="text-decoration-none">
            <h5 class="card-title">${show.name}</h5>
          </a>
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-outline-danger btn-sm">
              <i class="favorite">🤍</i>
            </button>
            <span class="text-warning"><i>⭐</i> ${show.rating?.average || 'N/A'}</span>
          </div>
        </div>
      </div>`;
    gallery.appendChild(col);
  });

  pageLabel.textContent = `Page ${currentPage}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = end >= shows.length;

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderFiltered(shows);
    }
  };

  nextBtn.onclick = () => {
    if (currentPage * showsPerPage < shows.length) {
      currentPage++;
      renderFiltered(shows);
    }
  };
}

const filters = {
  showStatus,
  showType,
  genre: document.getElementById("genre"),
  language: document.getElementById("language"),
  country: document.getElementById("country"),
  network: document.getElementById("network"),
  webChannel: document.getElementById("webChannel"),
  rating: document.getElementById("rating"),
  runtime: document.getElementById("runtime"),
  sortBy: document.getElementById("show-sort"),
};

Object.values(filters).forEach(select => {
  select.addEventListener("change", () => {
    applyFilters();
  });
});

function applyFilters() {
  let filtered = [...allShows];

  if (filters.showStatus.value) {
    filtered = filtered.filter(show => show.status === filters.showStatus.value);
  }

  if (filters.showType.value) {
    filtered = filtered.filter(show => show.type === filters.showType.value);
  }

  if (filters.genre.value) {
    filtered = filtered.filter(show => show.genres.includes(filters.genre.value));
  }

  if (filters.language.value) {
    filtered = filtered.filter(show => show.language === filters.language.value);
  }

  if (filters.country.value) {
    filtered = filtered.filter(show =>
      show.network?.country?.name === filters.country.value ||
      show.webChannel?.country?.name === filters.country.value
    );
  }

  if (filters.network.value) {
    filtered = filtered.filter(show => show.network?.name === filters.network.value);
  }

  if (filters.webChannel.value) {
    filtered = filtered.filter(show => show.webChannel?.name === filters.webChannel.value);
  }

  if (filters.rating.value) {
    filtered = filtered.filter(show => Math.floor(show.rating?.average || 0) == filters.rating.value);
  }

  if (filters.runtime.value) {
    filtered = filtered.filter(show => show.runtime == filters.runtime.value);
  }

  const sortValue = filters.sortBy.value;

if (sortValue === "1" || sortValue === "7") {
  filtered = filtered.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
}

if (sortValue === "2" || sortValue === "8") {
  filtered = filtered.sort((a, b) => (a.rating?.average || 0) - (b.rating?.average || 0));
}

if (sortValue === "3") {
  filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
}

if (sortValue === "4") {
  filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
}

if (sortValue === "5") {
  filtered = filtered.sort((a, b) => b.id - a.id);
}

if (sortValue === "6") {
  filtered = filtered.sort((a, b) => a.id - b.id);
}

  currentPage = 1;
  renderFiltered(filtered);
}

const searchForm = document.getElementById("searchForm");


const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault(); 
    if (!searchForm.checkValidity()) {
      e.stopPropagation();
    }

  searchForm.classList.add("was-validated");

    const query = searchInput.value.trim();
    if (!query) return;

    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(results => {
        const gallery = document.getElementById("showsGallery");
        gallery.innerHTML = "";

        if (results.length === 0) {
          gallery.innerHTML = "<p>No results found.</p>";
          return;
        }

        results.forEach(result => {
          const show = result.show;
          const col = document.createElement("div");
          col.className = "col-6 col-md-4 col-lg-custom mb-4";
          col.innerHTML = `
            <div class="card h-100">
              <a href="showInfo.html?id=${show.id}" target="_blank">
                <img src="${show.image?.medium || ''}" class="card-img-top" alt="${show.name}">
              </a>
              <div class="card-body bg-info-subtle text-info-emphasis">
                <a href="show.html?id=${show.id}" class="text-decoration-none">
                  <h5 class="card-title">${show.name}</h5>
                </a>
                <span class="text-warning"><i>⭐</i> ${show.rating?.average || 'N/A'}</span>
              </div>
            </div>
          `;
          gallery.appendChild(col);
        });
      });
  });

  const urlParams = new URLSearchParams(window.location.search);
const queryFromUrl = urlParams.get("search");

if (queryFromUrl) {
  searchInput.value = queryFromUrl;

  fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(queryFromUrl)}`)
    .then(res => res.json())
    .then(results => {
      const gallery = document.getElementById("showsGallery");
      gallery.innerHTML = "";

      if (results.length === 0) {
        gallery.innerHTML = "<p>No results found.</p>";
        return;
      }

      results.forEach(result => {
        const show = result.show;
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-custom mb-4";
        col.innerHTML = `
          <div class="card h-100">
            <a href="show.html?id=${show.id}" target="_blank">
              <img src="${show.image?.medium || ''}" class="card-img-top" alt="${show.name}">
            </a>
            <div class="card-body bg-info-subtle text-info-emphasis">
              <a href="show.html?id=${show.id}" class="text-decoration-none">
                <h5 class="card-title">${show.name}</h5>
              </a>
              <span class="text-warning"><i>⭐</i> ${show.rating?.average || 'N/A'}</span>
            </div>
          </div>
        `;
        gallery.appendChild(col);
      });
    });
}

