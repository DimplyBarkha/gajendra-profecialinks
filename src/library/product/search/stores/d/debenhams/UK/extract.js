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
    
    let URL = window.location.href;
    const recordSelector = document.querySelectorAll("div.t-product-list__product");
    recordSelector.forEach(x => {
      const div = document.createElement("div");
      div.className = "custom-attr-product-search-url";
      div.style.display = "none";
      div.textContent = URL;
      x.appendChild(div);
    });

  });
  await applyScroll(context);
  return await context.extract(productDetails, {transform});
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    transform,
    domain: 'debenhams.com',
    zipcode: '',
  },
  implementation
};
