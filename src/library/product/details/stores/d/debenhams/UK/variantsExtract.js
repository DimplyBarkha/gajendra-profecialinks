
const { transform } = require("../variantTransform");

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    const variantsEl = document.evaluate("//div[contains(@class, 'dbh-product-color-selector')]//div[contains(@class, 'pw-swatch__item')]//a", document, null, XPathResult.ANY_TYPE);
    let variants = [];
    let it = null;
    do {
      it = variantsEl.iterateNext();
      if (it) {
        variants.push(it);
      }
    }
    while(it != null);
    let variantData = "";
    if (variants.length) {
      variants.forEach(x => {
        const aHref = x.href;
        if (aHref) {
          variantData = variantData.concat(`<span class="variant-id">${aHref.replace(/.*_(\d+)_-1.*/, "$1")}</span>`);
          variantData = variantData.concat(`<span class="variant-url">${aHref}</span>`);
        }
      });
    } else {
      const aHref = window.location.href;
      variantData = variantData.concat(`<span class="variant-id">${aHref.replace(/.*_(\d+)_-1.*/, "$1")}</span>`);
      variantData = variantData.concat(`<span class="variant-url">${aHref}</span>`);
    }
    addHiddenDiv("custom-attr-product-variant", variantData);
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    transform,
    domain: 'debenhams.com',
    zipcode: '',
  },
  implementation
};
