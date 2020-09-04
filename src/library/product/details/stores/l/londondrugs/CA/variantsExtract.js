const { cleanUp } = require("../../../../shared");

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { variants } = dependencies;

  await context.evaluate(async () => {
    let sku = document.querySelector('span[itemprop="productID"]').innerText;
    let isVariantAvailable = document.querySelector(".product-variations");
    if (!isVariantAvailable && sku) {
      const body = document.querySelector("body");
      body.setAttribute("variants", sku);
    }
  });

  return await context.extract(variants, { transform });
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
