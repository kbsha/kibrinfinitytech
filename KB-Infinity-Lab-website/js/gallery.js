const filterButtons = document.querySelectorAll(".gallery-controls button");
const items = document.querySelectorAll(".gallery-item");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    items.forEach(item => {
      const categories = item.dataset.category;
      item.style.display =
        filter === "all" || categories.includes(filter)
        ? "block" : "none";
    });
  });
});

/* ===== STORY MODAL ===== */
const modal = document.getElementById("storyModal");
const modalImg = document.getElementById("modalImage");
const modalVid = document.getElementById("modalVideo");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDescription");

items.forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const video = item.querySelector("video");
    const youtube = item.querySelector(".youtube-embed");
    const title = item.querySelector("h3").innerText;
    const desc = item.querySelector("p").innerText;

    modal.style.display = "block";
    modalTitle.innerText = title;
    modalDesc.innerText = desc;

    if (img) {
      modalImg.src = img.src;
      modalImg.style.display = "block";
      modalVid.style.display = "none";
      document.getElementById("modalYoutube").style.display = "none";
    } else if (video) {
      modalVid.src = video.src;
      modalVid.style.display = "block";
      modalImg.style.display = "none";
      document.getElementById("modalYoutube").style.display = "none";
    } else if (youtube) {
      const youtubeIframe = youtube.cloneNode(true);
      const modalYoutube = document.getElementById("modalYoutube");
      modalYoutube.innerHTML = "";
      modalYoutube.appendChild(youtubeIframe);
      modalYoutube.style.display = "block";
      modalImg.style.display = "none";
      modalVid.style.display = "none";
    }
  });
});

document.querySelector(".close").onclick = () => {
  modal.style.display = "none";
  modalVid.pause();
};
