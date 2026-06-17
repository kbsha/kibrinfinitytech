const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const blogCards = document.querySelectorAll(".blog-card");

function filterBlogs() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  blogCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const categories = card.dataset.category;

    const matchesText = text.includes(searchText);
    const matchesCategory = category === "all" || categories.includes(category);

    card.style.display = (matchesText && matchesCategory) ? "block" : "none";
  });
}

searchInput.addEventListener("input", filterBlogs);
categoryFilter.addEventListener("change", filterBlogs);
