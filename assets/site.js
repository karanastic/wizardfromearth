(() => {
  "use strict";

  const tracks = window.WFE_TRACKS || [];

  const heroTitle = document.querySelector("#hero-title");
  if (heroTitle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const headline = heroTitle.textContent.trim();
    const words = headline.split(/\s+/);
    heroTitle.setAttribute("aria-label", headline);
    heroTitle.innerHTML = words
      .map((word, index) => `<span class="hero-word" aria-hidden="true" style="--word-index:${index}">${word}</span>`)
      .join(" ");
    heroTitle.classList.add("has-word-reveal");
  }

  const artifactOptions = [
    {
      src: "photos/wfe-04.webp",
      alt: "wizardfromearth with Elijah Wood at MegaCon Orlando",
      caption: "ARTIFACT 04 / MIDDLE-EARTH CONTACT",
    },
    {
      src: "photos/wfe-05.webp",
      alt: "Close portrait of wizardfromearth wearing sunglasses",
      caption: "ARTIFACT 05 / REFLECTED SIGNAL",
    },
  ];
  const selectedArtifact = artifactOptions[Math.floor(Math.random() * artifactOptions.length)];
  const artifactImage = document.querySelector("#random-artifact-image");
  const artifactCaption = document.querySelector("#random-artifact-caption");
  if (artifactImage && artifactCaption) {
    artifactImage.src = selectedArtifact.src;
    artifactImage.alt = selectedArtifact.alt;
    artifactCaption.textContent = selectedArtifact.caption;
  }

  const audio = document.querySelector("#audio");
  const player = document.querySelector("#player");
  const title = document.querySelector("#player-title");
  const toggle = document.querySelector("#play-toggle");
  const currentTime = document.querySelector("#current-time");
  const duration = document.querySelector("#duration");
  const progress = document.querySelector("#progress");
  const progressFill = document.querySelector("#progress-fill");
  const download = document.querySelector("#player-download");
  let currentIndex = -1;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  };

  const syncTrackState = () => {
    document.querySelectorAll(".track").forEach((track) => track.classList.remove("is-active", "is-playing"));
    if (currentIndex < 0) return;
    const current = document.querySelector(`.track[data-index="${currentIndex}"]`);
    current?.classList.add("is-active");
    if (!audio.paused) current?.classList.add("is-playing");
  };

  const loadTrack = (index, autoplay = true) => {
    const track = tracks[index];
    if (!track) return;
    currentIndex = index;
    audio.src = track.stream;
    title.textContent = track.collection === "karanastic" ? `${track.title} — with Karanastic` : track.title;
    download.href = track.mp3;
    player.classList.remove("is-idle");
    syncTrackState();
    if (autoplay) audio.play().catch(() => {});
  };

  const togglePlayback = () => {
    if (currentIndex < 0) return loadTrack(0);
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const step = (direction) => {
    if (!tracks.length) return;
    loadTrack(currentIndex < 0 ? 0 : (currentIndex + direction + tracks.length) % tracks.length);
  };

  document.querySelector(".archive")?.addEventListener("click", (event) => {
    const control = event.target.closest("[data-play]");
    if (!control) return;
    const index = Number(control.dataset.play);
    if (index === currentIndex) togglePlayback();
    else loadTrack(index);
  });

  toggle?.addEventListener("click", togglePlayback);
  document.querySelector("#previous")?.addEventListener("click", () => step(-1));
  document.querySelector("#next")?.addEventListener("click", () => step(1));

  audio?.addEventListener("play", () => {
    toggle.textContent = "Ⅱ";
    toggle.setAttribute("aria-label", "Pause");
    player.classList.add("is-playing");
    syncTrackState();
  });
  audio?.addEventListener("pause", () => {
    toggle.textContent = "▶";
    toggle.setAttribute("aria-label", "Play");
    player.classList.remove("is-playing");
    syncTrackState();
  });
  audio?.addEventListener("ended", () => step(1));
  audio?.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });
  audio?.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);
    progressFill.style.width = `${(audio.currentTime / audio.duration) * 100 || 0}%`;
  });
  progress?.addEventListener("click", (event) => {
    if (!audio.duration) return;
    const bounds = progress.getBoundingClientRect();
    audio.currentTime = ((event.clientX - bounds.left) / bounds.width) * audio.duration;
  });

  const search = document.querySelector("#track-search");
  const visibleCount = document.querySelector("#visible-count");
  const noResults = document.querySelector("#no-results");
  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll(".track").forEach((track) => {
      const visible = !query || track.dataset.search.includes(query);
      track.hidden = !visible;
      if (visible) count += 1;
    });
    const featuredVisible = [...document.querySelectorAll("#featured-track-list .track")].some((track) => !track.hidden);
    document.querySelector(".cross-signal")?.classList.toggle("is-filter-empty", !featuredVisible && Boolean(query));
    visibleCount.textContent = count;
    noResults.hidden = count !== 0;
  });

  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    formStatus.textContent = "Encoding transmission…";
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Transmission failed");
      form.reset();
      formStatus.textContent = "Transmission received.";
    } catch (_) {
      formStatus.textContent = "Signal lost. Please try again.";
    } finally {
      button.disabled = false;
    }
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const items = document.querySelectorAll(".track, .origin__copy > *, .merch__visual, .merch__copy > *, .transmit > *");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    items.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }
})();
