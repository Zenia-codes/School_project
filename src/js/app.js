// Když uživatel zadá počet produktů,
// zobrazí se výpočet ceny za produkty (např. 20 × $0.5 = $10).
// Když zadá počet objednávek, vypočítá se cena za objednávky.
// Když vybere balíček, přičte se cena podle balíčku.
// Když zaškrtne accounting nebo terminal, přidá se fixní částka.
// Nakonec se vše sečte do celkové ceny.

function Calculator(prices, inputs, summary) {
  this.prices = prices;
  this.inputs = inputs;
  this.summary = summary;
  this.total = 0;
  this.init();
}

// celková cena
Calculator.prototype.calculateTotal = function () {
  let total = 0;
  const prices = this.prices;
  const inputs = this.inputs;

  // Produkty a objednávky
  const productsVal = parseInt(inputs.products.value) || 0;
  const ordersVal = parseInt(inputs.orders.value) || 0;
  total += productsVal * prices.products;
  total += ordersVal * prices.orders;

  // Balíček
  const pack = inputs.package.dataset.value;
  if (pack) total += prices.package[pack];

  // Accounting / Terminal
  if (inputs.accounting.checked) total += prices.accounting;
  if (inputs.terminal.checked) total += prices.terminal;

  this.total = total;
  this.updateTotal();
};

// Zobrazení celkové ceny
Calculator.prototype.updateTotal = function () {
  const totalBox = this.summary.total;
  totalBox.priceSpan.innerText = "$" + this.total.toFixed(2);

  this.total > 0
    ? totalBox.container.classList.add("open")
    : totalBox.container.classList.remove("open");
};

// Obsluha číselných inputů
Calculator.prototype.handleNumberInput = function (key) {
  const input = this.inputs[key];
  const item = this.summary.items[key];
  const price = this.prices[key];

  input.addEventListener("input", () => {
    const val = parseInt(input.value) || 0;
    if (val > 0) {
      item.classList.add("open");
      item.querySelector(".item__calc").innerText = `${val} * $${price}`;
      item.querySelector(".item__price").innerText =
        "$" + (val * price).toFixed(2);
    } else {
      item.classList.remove("open");
    }
    this.calculateTotal();
  });
};

// checkboxy
Calculator.prototype.handleCheckbox = function (key) {
  const input = this.inputs[key];
  const item = this.summary.items[key];
  const price = this.prices[key];

  input.addEventListener("change", () => {
    if (input.checked) {
      item.classList.add("open");
      item.querySelector(".item__price").innerText = "$" + price;
    } else {
      item.classList.remove("open");
      item.querySelector(".item__price").innerText = "$0.00";
    }
    this.calculateTotal();
  });
};

//package
Calculator.prototype.handlePackage = function () {
  const wrapper = this.inputs.package;
  const header = wrapper.querySelector(".select__input");
  const options = wrapper.querySelectorAll(".select__dropdown li");
  const item = this.summary.items.package;
  const prices = this.prices.package;

  header.addEventListener("click", () => {
    wrapper.classList.toggle("open");
  });

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const value = opt.dataset.value;
      const text = opt.innerText;

      wrapper.dataset.value = value;
      header.innerText = text;
      wrapper.classList.remove("open");

      item.classList.add("open");
      item.querySelector(".item__calc").innerText = text;
      item.querySelector(".item__price").innerText = "$" + prices[value];

      this.calculateTotal();
    });
  });
};

Calculator.prototype.init = function () {
  this.handleNumberInput("products");
  this.handleNumberInput("orders");
  this.handlePackage();
  this.handleCheckbox("accounting");
  this.handleCheckbox("terminal");
};

//definice cen
const prices = {
  products: 0.5,
  orders: 0.25,
  package: { basic: 0, professional: 25, premium: 60 },
  accounting: 35,
  terminal: 5,
};

//definice inputů
const inputs = {
  products: document.getElementById("products"),
  orders: document.getElementById("orders"),
  package: document.getElementById("package"),
  accounting: document.getElementById("accounting"),
  terminal: document.getElementById("terminal"),
};

//definice summary
const summary = {
  items: {
    products: document.querySelector('.list__item[data-id="products"]'),
    orders: document.querySelector('.list__item[data-id="orders"]'),
    package: document.querySelector('.list__item[data-id="package"]'),
    accounting: document.querySelector('.list__item[data-id="accounting"]'),
    terminal: document.querySelector('.list__item[data-id="terminal"]'),
  },
  total: {
    container: document.getElementById("total-price"),
    priceSpan: document.querySelector(".total__price"),
  },
};

const calculator = new Calculator(prices, inputs, summary);

// tlačítka pro smazání položky
Object.values(summary.items).forEach((itemEl) => {
  const btn = itemEl.querySelector(".item__remove");
  if (!btn) return;

  btn.addEventListener("click", () => {
    itemEl.classList.remove("open");
    const id = itemEl.dataset.id;

    switch (id) {
      case "products":
      case "orders":
        inputs[id].value = "";
        break;
      case "package":
        inputs.package.dataset.value = "";
        inputs.package.querySelector(".select__input").innerText =
          "Choose package";
        break;
      case "accounting":
      case "terminal":
        inputs[id].checked = false;
        break;
    }

    calculator.calculateTotal();
  });
});
