// handles resolution switching and auto-next functionality on watch page

document.addEventListener("DOMContentLoaded", () => {
  const videoEl = document.getElementById("anime-video");
  const resButtons = Array.from(
    document.querySelectorAll(".resolution-button"),
  );
  const episodeLinks = Array.from(document.querySelectorAll(".episode-link"));

  // helper to mark one button active and rest inactive
  function setActiveButton(activeBtn) {
    resButtons.forEach((b) => {
      b.classList.remove("bg-blue-600", "border-blue-500", "text-white");
      b.classList.add("bg-gray-800", "border-gray-700", "text-gray-400");
    });
    if (activeBtn) {
      activeBtn.classList.remove(
        "bg-gray-800",
        "border-gray-700",
        "text-gray-400",
      );
      activeBtn.classList.add("bg-blue-600", "border-blue-500", "text-white");
    }
  }

  // highlight initial resolution if it can be inferred from src
  const initialSrc = videoEl?.getAttribute("src") || "";
  resButtons.forEach((b) => {
    const label = b.getAttribute("data-reso");
    if (label && initialSrc.includes(label)) {
      setActiveButton(b);
    }
  });

  resButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reso = btn.getAttribute("data-reso");
      if (!reso) return;

      // mark clicked button active right away
      setActiveButton(btn);

      // fetch the video link for this resolution
      try {
        const chapterId = window.location.pathname.split("/").pop() || "";
        const resp = await fetch(
          `https://api.sansekai.my.id/api/anime/getvideo?chapterUrlId=${encodeURIComponent(
            chapterId,
          )}&reso=${encodeURIComponent(reso)}`,
        );
        const json = await resp.json();
        const link = json.data?.[0]?.stream?.[0]?.link;
        if (videoEl && link) {
          videoEl.src = link;
          videoEl.load();
          videoEl.play().catch(() => {});
        }
      } catch (err) {
        console.error("failed to load resolution", err);
      }
    });
  });

  // when video ends, automatically go to next episode if available
  if (videoEl) {
    videoEl.addEventListener("ended", () => {
      const currentUrl = window.location.pathname;
      const idx = episodeLinks.findIndex(
        (a) => a.getAttribute("href") === currentUrl,
      );
      if (idx !== -1 && idx < episodeLinks.length - 1) {
        window.location.href = episodeLinks[idx + 1].getAttribute("href");
      }
    });
  }
});
