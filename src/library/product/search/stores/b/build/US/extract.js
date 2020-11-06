const { transform } = require("../transform");

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await context.evaluate(async function() {
    const products = document.querySelectorAll("div.js-product-wrapper");
    products.forEach((pd, index) => {
      const manufacturerName = (window.dataLayer.products[index] || {}).manufacturer;
      const div = document.createElement("div");
      div.className = "custom-attr-product-manufacturer-name";
      div.style.display = "none";
      div.textContent = manufacturerName;
      pd.appendChild(div);
    });
  });
  await applyScroll(context);
  return await context.extract(productDetails, {transform});
}

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "build",
    transform,
    domain: "build.com",
    zipcode: "",
  },
  implementation
};
