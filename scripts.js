
let burgers = JSON.parse(localStorage.getItem("burgers")) || [];

const saveToStorage = () => {
  localStorage.setItem("burgers", JSON.stringify(burgers));
};


const createBurgerItem = (text) => {
  const newItem = { text: text, available: true, id: Date.now() };
  burgers.push(newItem);
  saveToStorage();
  return newItem;
};


const readBurgers = () => {
  return burgers;
};


const updateBurgerText = (oldText, newText) => {
  burgers = burgers.map((burger) =>
    burger.text === oldText ? { ...burger, text: newText } : burger
  );
  saveToStorage();
};

const toggleBurgerStatus = (text) => {
  burgers = burgers.map((burger) =>
    burger.text === text ? { ...burger, available: !burger.available } : burger
  );
  saveToStorage();
};

const removeBurgerItem = (text) => {
  burgers = burgers.filter((burger) => burger.text !== text);
  saveToStorage();
};


const burgerForm = document.querySelector("#burger-form");
const burgerInput = document.querySelector("#burger-input");
const burgerList = document.querySelector("#burger-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

const renderBurgerUI = (text, available = true) => {
  const burgerDiv = document.createElement("div");
  burgerDiv.classList.add("burger-item");

  if (available) {
    burgerDiv.classList.add("available");
  }

  burgerDiv.innerHTML = `
    <h3>${text}</h3>
    <button class="btn-status" title="Alterar Estoque"><i class="fa-solid fa-store"></i></button>
    <button class="btn-edit" title="Editar Nome"><i class="fa-solid fa-pen"></i></button>
    <button class="btn-remove" title="Excluir Item"><i class="fa-solid fa-trash"></i></button>
  `;

  burgerList.appendChild(burgerDiv);
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  burgerForm.classList.toggle("hide");
  burgerList.classList.toggle("hide");
};
const loadBurgers = () => {
  const data = readBurgers();
  data.forEach((burger) => {
    renderBurgerUI(burger.text, burger.available);
  });
};
burgerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = burgerInput.value;

  if (inputValue) {
    createBurgerItem(inputValue); 
    renderBurgerUI(inputValue, true);
    burgerInput.value = "";
  }
});
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest(".burger-item");
  let burgerTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    burgerTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("btn-status")) {
    parentEl.classList.toggle("available");
    toggleBurgerStatus(burgerTitle);
  }

  if (targetEl.classList.contains("btn-remove")) {
    parentEl.remove();
    removeBurgerItem(burgerTitle);
  }

  if (targetEl.classList.contains("btn-edit")) {
    toggleForms();
    editInput.value = burgerTitle;
    oldInputValue = burgerTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;

  if (editInputValue) {
    updateBurgerText(oldInputValue, editInputValue);


    const allItems = document.querySelectorAll(".burger-item");
    allItems.forEach((item) => {
      let title = item.querySelector("h3");
      if (title.innerText === oldInputValue) {
        title.innerText = editInputValue;
      }
    });
  }
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value.toLowerCase();
  const allItems = document.querySelectorAll(".burger-item");

  allItems.forEach((item) => {
    const title = item.querySelector("h3").innerText.toLowerCase();
    item.style.display = "flex";

    if (!title.includes(search)) {
      item.style.display = "none";
    }
  });
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  const allItems = document.querySelectorAll(".burger-item");

  allItems.forEach((item) => {
    switch (filterValue) {
      case "all":
        item.style.display = "flex";
        break;
      case "available":
        item.classList.contains("available")
          ? (item.style.display = "flex")
          : (item.style.display = "none");
        break;
      case "out":
        !item.classList.contains("available")
          ? (item.style.display = "flex")
          : (item.style.display = "none");
        break;
    }
  });
});
loadBurgers();