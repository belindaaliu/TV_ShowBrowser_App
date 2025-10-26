const baseUrl = "https://api.tvmaze.com/schedule";
const dateInput = document.getElementById("dateInput");
const countrySelect = document.getElementById("countrySelect");
const genreSelect = document.getElementById("genreSelect");
const scheduleDate = document.getElementById("scheduleDate");
const scheduleTableBody = document.getElementById("scheduleBody");
const thead = document.getElementById("timeHeaders");

let startHour = 12;
const slotsPerPage = 6;

document.getElementById("prevSlot").addEventListener("click", () => {
  if (startHour > 0) {
    startHour -= 1.5;
    fetchAndRenderSchedule();
  }
});

document.getElementById("nextSlot").addEventListener("click", () => {
  if (startHour + slotsPerPage * 0.5 < 24) {
    startHour += 1.5;
    fetchAndRenderSchedule();
  }
});

dateInput.value = new Date().toISOString().split("T")[0];
scheduleDate.textContent = new Date(dateInput.value).toDateString();

dateInput.addEventListener("change", fetchAndRenderSchedule);
countrySelect.addEventListener("change", fetchAndRenderSchedule);
genreSelect.addEventListener("change", fetchAndRenderSchedule);

fetchAndRenderSchedule();

function getTimeSlots() {
  const times = [];
  for (let i = 0; i < slotsPerPage; i++) {
    const hour = Math.floor((startHour * 2 + i) / 2);
    const mins = (startHour * 2 + i) % 2 === 0 ? "00" : "30";
    times.push(`${String(hour).padStart(2, '0')}:${mins}`);
  }
  return times;
}

function fetchAndRenderSchedule() {
  const rawDate = dateInput.value;
  const country = countrySelect.value || "US";
  const genre = genreSelect.value;

  const dateObj = new Date(rawDate + 'T00:00:00');
  const isoDate = dateObj.toISOString().split('T')[0];
  scheduleDate.textContent = dateObj.toDateString();

  fetch(`${baseUrl}?country=${country}&date=${isoDate}`)
    .then(res => res.json())
    .then(data => {
      const filtered = genre
        ? data.filter(item => item.show.genres.includes(genre))
        : data;

      const scheduleMap = {};

      filtered.forEach(item => {
        const channel = item.show.network?.name || item.show.webChannel?.name || "Unknown";
        const time = item.airtime;

        if (!scheduleMap[channel]) {
          scheduleMap[channel] = {};
        }

        scheduleMap[channel][time] = item;
      });

      renderSchedule(scheduleMap);
    });
}


function renderSchedule(scheduleMap) {
  const timeSlots = getTimeSlots();

  thead.innerHTML = `<th>Channel</th>`;
  timeSlots.forEach(time => {
    const th = document.createElement("th");
    th.textContent = time;
    thead.appendChild(th);
  });

  scheduleTableBody.innerHTML = "";

  for (const [channel, slots] of Object.entries(scheduleMap)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<th>${channel}</th>`;

    timeSlots.forEach(time => {
      const td = document.createElement("td");
      const show = slots[time];

      if (show) {
        td.innerHTML = `
          <a href="show.html?id=${show.show.id}" class="text-decoration-none">
            ${show.show.name}: ${show.airdate}
          </a>`;
      }

      tr.appendChild(td);
    });

    scheduleTableBody.appendChild(tr);
  }
}

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
