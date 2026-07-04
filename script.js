const revealItems = document.querySelectorAll(
  ".section h2, .manifesto-list p, .thesis-copy h3, .podcast-panel p, .documentary-panel p, .email-link, .site-footer p"
);
const thesisCards = document.querySelectorAll(".thesis-companies a");
const socialLinks = document.querySelectorAll(".social-row a");
const thesisIntro = document.querySelector(".thesis-intro");
const pageLoader = document.querySelector(".page-loader");
const heroVideo = document.querySelector(".hero-video");
const documentaryMedia = document.querySelector(".documentary-media");
const documentaryVideo = document.querySelector(".documentary-media video");

revealItems.forEach((item, index) => {
  item.classList.add("text-reveal");
  if (item.closest(".documentary-panel, .podcast-panel")) {
    item.style.transitionDelay = item.matches("p") ? "160ms" : "0ms";
  } else {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach(item => revealObserver.observe(item));
  thesisCards.forEach(card => revealObserver.observe(card));
  socialLinks.forEach(link => revealObserver.observe(link));
  if (thesisIntro) {
    revealObserver.observe(thesisIntro);
  }
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
  thesisCards.forEach(card => card.classList.add("is-visible"));
  socialLinks.forEach(link => link.classList.add("is-visible"));
  thesisIntro?.classList.add("is-visible");
}

window.setTimeout(() => {
  thesisIntro?.classList.add("is-visible");
}, 400);

if (documentaryMedia && documentaryVideo) {
  documentaryMedia.addEventListener("mouseenter", () => {
    documentaryVideo.currentTime = 0;
    documentaryVideo.play().catch(() => {});
  });

  documentaryMedia.addEventListener("mouseleave", () => {
    documentaryVideo.pause();
    documentaryVideo.currentTime = 0;
  });
}

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.play().catch(() => {});

  document.addEventListener(
    "touchstart",
    () => {
      heroVideo.play().catch(() => {});
    },
    { once: true }
  );
}

if (pageLoader) {
  const loaderStart = Date.now();
  const minLoaderDuration = 5800;
  let loaderHidden = false;

  const hideLoader = () => {
    if (loaderHidden) {
      return;
    }
    loaderHidden = true;
    const elapsed = Date.now() - loaderStart;
    const wait = Math.max(0, minLoaderDuration - elapsed);
    window.setTimeout(() => {
      pageLoader.classList.add("is-hidden");
      window.setTimeout(() => {
        document.body.classList.add("is-hero-ready");
      }, 750);
    }, wait);
  };

  const waitForHeroVideo = () => {
    if (!heroVideo || heroVideo.readyState >= 2) {
      window.setTimeout(hideLoader, 500);
      return;
    }

    const releaseWhenVideoStarts = () => {
      window.setTimeout(hideLoader, 300);
    };

    heroVideo.addEventListener(
      "loadeddata",
      releaseWhenVideoStarts,
      { once: true }
    );
    heroVideo.addEventListener(
      "canplay",
      releaseWhenVideoStarts,
      { once: true }
    );

    heroVideo.addEventListener("error", hideLoader, { once: true });
    window.setTimeout(hideLoader, 7600);
  };

  const startVideoCheck = () => {
    waitForHeroVideo();
  };

  if (document.readyState === "complete") {
    startVideoCheck();
  } else {
    window.addEventListener("load", startVideoCheck);
  }
} else {
  document.body.classList.add("is-hero-ready");
}
