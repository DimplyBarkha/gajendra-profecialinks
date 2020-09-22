// module.exports.implementation = ({ productPageSelector = defaultproductPageSelector } = {}) =>
async function implementation(inputs, parameters, context, dependencies) {
  const { productDetails, Helpers } = dependencies;
  const helpers = new Helpers(context);
  await context.evaluate(async () => {
    function addElementToDocument(key, value) {
      const catElement = document.createElement("div");
      catElement.id = key;
      catElement.style.display = "none";
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML =
          value.reduce((acc, val) => {
            return `${acc}<li>${val}</li>`;
          }, "<ul>") + "</ul>";
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
    }

    if (window.dataLayer) {
      const dataObj = window.dataLayer.find(
        (el) => el.event === "primaryProduct"
      );
      if (dataObj && dataObj.primaryProduct) {
        addElementToDocument("added_sku", dataObj.primaryProduct.productSKU);
      }
    }
  });
  // first check that the page is a valid product page
  return await context.extract(productDetails, {
    transform: parameters.transform,
  });
}
module.exports = { implementation };
