import { analyzeLostItem } from "./gemini.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyDOi6wewxYT_imET4WO3--Mhl_UH6HU2GA",
  authDomain: "lost-and-found-23708.firebaseapp.com",
  projectId: "lost-and-found-23708",
  storageBucket: "lost-and-found-23708.firebasestorage.app",
  messagingSenderId: "313548030264",
  appId: "1:313548030264:web:492582d91a0a2b229ec1cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".report-form");
  const modal = document.getElementById("itemModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

 
if (closeModalBtn && modal) {
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}


window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


  

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const type = document.getElementById("itemType").value;
      const manualCategory = document.getElementById("itemCategory").value;
      const name = document.getElementById("itemName").value.trim();
      const location = document.getElementById("itemLocation").value.trim();
      const description = document.getElementById("itemDescription").value.trim();

      if (!type || !manualCategory || !name || !location) {
        alert("Please fill all required fields");
        return;
      }

      let finalCategory = manualCategory.toLowerCase();



if (!finalCategory) {
  try {
    const aiCategory = await analyzeLostItem(
      `${name}. ${description || ""}`
    );
    finalCategory = aiCategory
      ? aiCategory.toLowerCase()
      : "others";
  } catch (err) {
    finalCategory = "others";
  }
}

try {
  await addDoc(collection(db, "items"), {
    type,
    category: finalCategory,
    name,
    location,
    description,
    time: new Date().toLocaleString()
  });

  
  window.location.href =
    type === "lost" ? "lost.html" : "found.html";

} catch (err) {
  console.error("Save failed:", err);
  alert("Could not save item. Check console.");
}

    });
  }

  

  async function renderItems(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "items"));
    const items = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(item => item.type === type);

    if (items.length === 0) {
      container.innerHTML = "<p class='empty'>No items reported yet.</p>";
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.dataset.category = item.category;

      card.innerHTML = `
        <h3>${item.name}</h3>
        <span class="category-tag">${item.category}</span>
        <p>📍 ${item.location}</p>
        <small>${item.time}</small>
        <button class="delete-btn">Delete</button>
      `;

      card.querySelector(".delete-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm("Delete this item?")) return;
        await deleteDoc(doc(db, "items", item.id));
        renderItems(type, containerId);
      });

      card.addEventListener("click", () => {
  modal.style.display = "flex";

  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalLocation").textContent =
    "📍 " + item.location;

  document.getElementById("modalDescription").textContent =
    item.description || "No description provided";

  document.getElementById("modalTime").textContent = item.time;
});

      container.appendChild(card);
    });
  }


  
  if (document.body.classList.contains("lost-page")) {
    renderItems("lost", "lostItemsContainer");
  }

  if (document.body.classList.contains("found-page")) {
    renderItems("found", "foundItemsContainer");
  }
});



document.addEventListener("click", (e) => {
  if (!e.target.matches(".filters button")) return;

  const selected = e.target.dataset.category;

  document.querySelectorAll(".item-card").forEach(card => {
    card.style.display =
      selected === "all" || card.dataset.category === selected
        ? "block"
        : "none";
  });
});
