
/* ===============================
   Global Data
================================ */
let markets = JSON.parse(localStorage.getItem("markets")) || [];
let editIndex = -1;

/* ===============================
   Save & Load
================================ */
function saveMarkets() {
  localStorage.setItem("markets", JSON.stringify(markets));
}

/* ===============================
   Load Report
================================ */
function loadReport(list = markets) {

  let today = new Date().toISOString().slice(0,10);
  let month = today.slice(0,7);
  let year = today.slice(0,4);

  let todayTotal = 0;
  let monthTotal = 0;
  let yearTotal = 0;

  let marketList = document.getElementById("marketList");
  marketList.innerHTML = "";

  list.forEach((m, index) => {

    if (m.date === today) todayTotal += m.total;
    if (m.date.startsWith(month)) monthTotal += m.total;
    if (m.date.startsWith(year)) yearTotal += m.total;

    let li = document.createElement("li");
    li.innerHTML = `
      ${m.item} - ${m.qty} ${m.unit}
      × ${m.unitPrice} ৳
      = <b>${m.total.toFixed(2)} ৳</b>
    `;

    // Delete Button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.style.background = "red";
    delBtn.onclick = () => deleteMarket(index);

    // Edit Button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.style.background = "orange";
    editBtn.onclick = () => editMarket(index);

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    marketList.appendChild(li);
  });

  document.getElementById("todayTotal").innerText = todayTotal.toFixed(2);
  document.getElementById("monthTotal").innerText = monthTotal.toFixed(2);
  document.getElementById("yearTotal").innerText = yearTotal.toFixed(2);
}

/* ===============================
   Add / Update Market
================================ */
function addMarket() {

  let item = document.getElementById("item").value.trim();
  let qty = parseFloat(document.getElementById("weight").value);
  let unit = document.getElementById("unit").value;
  let unitPrice = parseFloat(document.getElementById("unitPrice").value);

  if (!item || !qty || !unitPrice) {
    alert("সব তথ্য সঠিকভাবে দিন");
    return;
  }

  // Base quantity conversion
  let baseQty = qty;

  if (unit === "g") baseQty = qty / 1000;      // gram → kg
  if (unit === "kg") baseQty = qty;             // kg
  if (unit === "liter") baseQty = qty;          // liter
  if (unit === "pcs") baseQty = qty;            // number

  let total = baseQty * unitPrice;

  if (editIndex >= 0) {
    markets[editIndex] = {
      item, qty, unit, unitPrice, total,
      date: markets[editIndex].date
    };
    editIndex = -1;
    alert("Market Updated");
    document.getElementById("addBtn").innerText = "যোগ করুন";
  } else {
    markets.push({
      item, qty, unit, unitPrice, total,
      date: new Date().toISOString().slice(0,10)
    });
    alert("বাজার যোগ হয়েছে");
  }

  saveMarkets();
  loadReport();
  clearForm();
}

/* ===============================
   Edit Market
================================ */
function editMarket(index) {
  let m = markets[index];
  document.getElementById("item").value = m.item;
  document.getElementById("weight").value = m.qty;
  document.getElementById("unit").value = m.unit;
  document.getElementById("unitPrice").value = m.unitPrice;
  editIndex = index;
  document.getElementById("addBtn").innerText = "Update";
}

/* ===============================
   Delete Market
================================ */
function deleteMarket(index) {
  let itemName = markets[index].item;

  let confirmDelete = confirm(
      `"${itemName}" মুছে ফেলতে চান?`
  );

  if (!confirmDelete) {
    // Cancel চাপলে কিছুই হবে না
    return;
  }

  // OK চাপলে delete হবে
  markets.splice(index, 1);
  saveMarkets();
  loadReport();
  alert(itemName + " মুছে দেওয়া হয়েছে");

}

/* ===============================
   Clear Form
================================ */
function clearForm() {
  document.getElementById("item").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("unit").value = "kg";
  document.getElementById("unitPrice").value = "";
}

/* ===============================
   Clear All
================================ */
function clearAll() {
  if (confirm("সব ডাটা মুছে ফেলবেন?")) {
    markets = [];
    saveMarkets();
    loadReport();
    alert("সব ডাটা মুছে দেওয়া হয়েছে");
  }
}

/* ===============================
   Auto Unit Select (Optional)
================================ */
document.getElementById("item").addEventListener("input", function () {
  let v = this.value.toLowerCase();
  if (v.includes("ডিম")) document.getElementById("unit").value = "pcs";
  if (v.includes("তেল")) document.getElementById("unit").value = "liter";
});

/* ===============================
   On Load
================================ */
window.onload = () => loadReport();

