const { cleanUp } = require("../../../../shared");

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { variants } = dependencies;

  const targetSelector = 'span[itemprop="productID"]';
  const result = await context.evaluate((selector) => {
    return Boolean(document.querySelector(selector));
  }, targetSelector);

  if (result) {
    await context.evaluate(async (selector) => {
      let sku = document.querySelector(selector).innerText;
      let isVariantAvailable = document.querySelector(".product-variations");
      if (!isVariantAvailable && sku) {
        const body = document.querySelector("body");
        body.setAttribute("variants", sku);
      }
    }, targetSelector);
    return await context.extract(variants, { transform });
  } else {
    throw new Error("Target element not found");
  }
}

module.exports = {
  implements: "product/details/variants/variantsExtract",
  parameterValues: {
    country: "CA",
    store: "londondrugs",
    transform: cleanUp,
    domain: "londondrugs.com",
    zipcode: "",
  },
  implementation,
};
