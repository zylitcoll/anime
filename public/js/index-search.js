// client-side search logic for the homepage

async function performSearch() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput?.value.trim();
  if (!query) return;
  try {
    const res = await fetch(
      `https://api.sansekai.my.id/api/anime/search?query=${encodeURIComponent(query)}`,
    );
    const json = await res.json();
    const results = Array.isArray(json) ? json : json.data?.[0]?.result || [];
    const grid = document.getElementById("gridContainer");
    if (!grid) return;
    grid.innerHTML = "";
    results.forEach((anime) => {
      const item = document.createElement("div");
      item.className =
        "group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105";
      item.innerHTML = `
            <a href="/anime/${anime.url}">
              <div class="aspect-3/4 overflow-hidden">
                <img src="${anime.cover}" alt="${anime.judul}" class="w-full h-full object-cover" loading="lazy" />
              </div>
              <div class="absolute top-2 right-2 bg-blue-600 text-xs font-bold px-2 py-1 rounded">${anime.lastch || ""}</div>
              <div class="p-3">
                <h2 class="text-sm font-semibold line-clamp-2 min-h-10 group-hover:text-blue-400 transition-colors">${anime.judul}</h2>
                <p class="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>${anime.lastup || ""}
                </p>
              </div>
            </a>
          `;
      grid.appendChild(item);
    });
  } catch (e) {
    console.error(e);
  }
}

document.getElementById("searchBtn")?.addEventListener("click", performSearch);
