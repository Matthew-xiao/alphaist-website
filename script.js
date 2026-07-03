const revealItems = document.querySelectorAll(
  ".section h2, .manifesto-list p, .thesis-copy h3, .podcast-panel p, .documentary-panel p, .email-link, .site-footer p"
);
const thesisCards = document.querySelectorAll(".thesis-companies a");
const socialLinks = document.querySelectorAll(".social-row a");
const thesisIntro = document.querySelector(".thesis-intro");
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

if (documentaryMedia && documentaryVideo) {
  documentaryMedia.addEventListener("mouseenter", () => {
    documentaryVideo.currentTime = 0;
    documentaryVideo.play();
  });

  documentaryMedia.addEventListener("mouseleave", () => {
    documentaryVideo.pause();
    documentaryVideo.currentTime = 0;
  });
}
