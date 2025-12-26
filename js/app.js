document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // COMMON ELEMENTS
  // ===============================
  const form = document.querySelector(".report-form");
  const modal = document.getElementById("itemModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // ===============================
  // ADD ITEM (add.html)
  // ===============================
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const type = document.getElementById("itemType").value.toLowerCase();
      const name = document.getElementById("itemName").value.trim();
      const location = document.getElementById("itemLocation").value.trim();
      const description = document.getElementById("itemDescription").value.trim();

      if (!type || !name || !location) {
        alert("Please fill all required fields");
        return;
      }

      const newItem = {
        name,
        location,
        description,
        time: new Date().toLocaleString()
      };

      const storageKey = type === "lost" ? "lostItems" : "foundItems";
      const items = JSON.parse(localStorage.getItem(storageKey)) || [];

      items.push(newItem);
      localStorage.setItem(storageKey, JSON.stringify(items));

      window.location.href = type === "lost" ? "lost.html" : "found.html";
    });
  }

  // ===============================
  // RENDER ITEMS
  // ===============================
  function renderItems(storageKey, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = JSON.parse(localStorage.getItem(storageKey)) || [];

    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = "<p class='empty'>No items reported yet.</p>";
      return;
    }

    items.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "item-card";

  card.innerHTML = `
    <h3>${item.name}</h3>
    <p>📍 ${item.location}</p>
    <small>${item.time}</small>
    <button class="delete-btn">Delete</button>
  `;

  // OPEN MODAL when clicking card (but NOT delete button)
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) return;
    openModal(item);
  });

  // DELETE BUTTON LOGIC
  card.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this item?")) return;

    items.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(items));

    renderItems(storageKey, containerId);
  });

  container.appendChild(card);
});

  }

  // ===============================
  // MODAL
  // ===============================
  function openModal(item) {
    document.getElementById("modalTitle").innerText = item.name;
    document.getElementById("modalLocation").innerText = "📍 " + item.location;
    document.getElementById("modalDescription").innerText =
      item.description || "No description provided.";
    document.getElementById("modalTime").innerText = item.time;

    modal.style.display = "flex";
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }

  // ===============================
  // AUTO LOAD
  // ===============================
  if (document.body.classList.contains("lost-page")) {
    renderItems("lostItems", "lostItemsContainer");
  }

  if (document.body.classList.contains("found-page")) {
    renderItems("foundItems", "foundItemsContainer");
  }

});
