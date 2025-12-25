/**********************
 * ADD ITEM FORM
 **********************/
const form = document.querySelector(".report-form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("itemType").value;
    const name = document.getElementById("itemName").value;
    const location = document.getElementById("itemLocation").value;
    const description = document.getElementById("itemDescription").value;

    if (!type || !name || !location) return;

    const newItem = {
      id: Date.now(),
      name,
      location,
      description,
      time: new Date().toLocaleString()
    };

    const key = type === "Lost" ? "lostItems" : "foundItems";
    const items = JSON.parse(localStorage.getItem(key)) || [];

    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));

    window.location.href = type === "Lost" ? "lost.html" : "found.html";
  });
}

/**********************
 * RENDER ITEMS
 **********************/
function renderItems(containerId, storageKey, tagClass, tagText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const items = JSON.parse(localStorage.getItem(storageKey)) || [];
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML =
      "<p style='text-align:center;'>No items reported yet.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="https://via.placeholder.com/300x200">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="meta">📍 ${item.location} · ⏰ ${item.time}</p>
        <span class="tag ${tagClass}">${tagText}</span>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    card.addEventListener("click", () => openModal(item));

    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const updatedItems = items.filter(i => i.id !== item.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));

      renderItems(containerId, storageKey, tagClass, tagText);
    });

    container.appendChild(card);
  });
}

renderItems("lostItems", "lostItems", "lost", "Lost");
renderItems("foundItems", "foundItems", "found", "Found");

/**********************
 * MODAL
 **********************/
const modal = document.getElementById("itemModal");
const closeModalBtn = document.getElementById("closeModal");

function openModal(item) {
  if (!modal) return;

  document.getElementById("modalTitle").innerText = item.name;
  document.getElementById("modalLocation").innerText = "📍 " + item.location;
  document.getElementById("modalDescription").innerText =
    item.description || "No description provided.";
  document.getElementById("modalTime").innerText = item.time;

  modal.style.display = "flex";
}

if (closeModalBtn) {
  closeModalBtn.onclick = () => (modal.style.display = "none");
}

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};
