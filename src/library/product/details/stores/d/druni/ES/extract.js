const { transform } = require("./transform");

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const data = [];
  const variantCount = await context.evaluate(async function () {
    return document.querySelector(".swatch-attribute")
      ? document.querySelectorAll(".swatch-attribute .swatch-option").length
      : 0;
  });
  const QuantityCount = await context.evaluate(async function () {
    return document.querySelector("#super-product-table")
      ? document.querySelectorAll("#super-product-table .item").length
      : 0;
  });
  if (variantCount !== 0) {
    for (let i = 0; i < variantCount; i++) {
      await context.click(
        `.swatch-attribute .swatch-option:nth-of-type(${i + 1})`
      );
      await context.evaluate(async function () {
        function addElementToDom(element, id) {
          const div = document.createElement("div");
          div.id = id;
          div.innerHTML = element;
          document.querySelector("body").appendChild(div);
        }
        // const shortName = document.querySelector(".fotorama__thumb img")
        //   ? document.querySelector(".fotorama__thumb img").src
        //   : "";

        // let alternateImages = shortName;
        // addElementToDom(alternateImages, "alternateImages");
      });
      const extract = await context.extract(productDetails, { transform });
      data.push(extract);
      await context.evaluate(async function () {
        const elementsIds = [];

        elementsIds.forEach((elemId) => {
          const element = document.querySelector(`div#${elemId}`);
          if (element) {
            element.parentNode.removeChild(element);
          }
        });
      });
    }
    return data;
  } else if (QuantityCount !== 0) {
    for (let i = 0; i < QuantityCount; i++) {
      await context.click(`#super-product-table .item:nth-of-type(${i + 1})`);
      await context.evaluate(async function () {
        function addElementToDom(element, id) {
          const div = document.createElement("div");
          div.id = id;
          div.innerHTML = element;
          document.querySelector("body").appendChild(div);
        }
        const shortName = document.querySelector(
          "#super-product-table .special-price"
        )
          ? document.querySelector(
              `#super-product-table .special-price:nth-of-type(${i + 1}`
            ).innerText
          : "";

        let price = shortName;
        addElementToDom(price, "price");
      });
      const extract = await context.extract(productDetails, { transform });
      data.push(extract);
      await context.evaluate(async function () {
        const elementsIds = ["price"];

        elementsIds.forEach((elemId) => {
          const element = document.querySelector(`div#${elemId}`);
          if (element) {
            element.parentNode.removeChild(element);
          }
        });
      });
    }
    return data;
  } else {
    return data;
  }
}

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "ES",
    store: "druni",
    transform: transform,
    domain: "druni.es",
    zipcode: "",
  },
  implementation,
};
