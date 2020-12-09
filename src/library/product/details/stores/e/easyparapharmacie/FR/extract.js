const { cleanUp } = require("../../../../shared");

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDom(element, id) {
      const div = document.createElement("div");
      div.id = id;
      div.innerHTML = element;
      document.querySelector("body").appendChild(div);
    }

    const brandText = document.querySelector(".product-shop .product-name .product-brand") ? document.querySelector(".product-shop .product-name .product-brand").innerText : "";
    const shortName = document.querySelector(".product-shop .product-name .h1") ? document.querySelector(".product-shop .product-name .h1").innerText : "";

    let nameExtended = shortName;
    if (brandText && shortName && !shortName.toLowerCase().includes(brandText.toLowerCase())) {
      nameExtended = `${brandText} - ${shortName}`;
    }
    addElementToDom(nameExtended, "nameExtended");
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "FR",
    store: "easyparapharmacie",
    transform: cleanUp,
    domain: "easyparapharmacie.com",
    zipcode: "",
  },
};
