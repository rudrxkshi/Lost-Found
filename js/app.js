// Handle Add Item Form
const form = document.querySelector(".report-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const type = document.getElementById("itemType").value;
    const name = document.getElementById("itemName").value;
    const location = document.getElementById("itemLocation").value;
    const description = document.getElementById("itemDescription").value;

    const newItem = {
      name,
      location,
      description,
      time: "Just now"
    };

    if (type === "Lost") {
      const lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
      lostItems.push(newItem);
      localStorage.setItem("lostItems", JSON.stringify(lostItems));
      window.location.href = "lost.html";
    } else {
      const foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
      foundItems.push(newItem);
      localStorage.setItem("foundItems", JSON.stringify(foundItems));
      window.location.href = "found.html";
    }
  });
}

// Load Lost Items on lost.html
const lostItemsContainer = document.getElementById("lostItems");

if (lostItemsContainer) {
  const lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];

  if (lostItems.length === 0) {
    lostItemsContainer.innerHTML = "<p style='text-align:center;'>No lost items reported yet.</p>";
  }

  lostItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="https://via.placeholder.com/300x200" alt="${item.name}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="meta">📍 ${item.location} · ⏰ ${item.time || "Just now"}</p>
        <span class="tag lost">Lost</span>
      </div>
    `;

    lostItemsContainer.appendChild(card);
  });
}

// ================= FOUND ITEMS DISPLAY =================
const foundItemsContainer = document.getElementById("foundItems");

if (foundItemsContainer) {
  const foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];

  foundItemsContainer.innerHTML = "";

  foundItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="https://via.placeholder.com/300x200" alt="Found Item">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="meta">📍 ${item.location} · 🕒 ${item.time}</p>
        <span class="tag found">Found</span>
      </div>
    `;

    foundItemsContainer.appendChild(card);
  });
}
