const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to fetch sku number and gtin from script tag as not available directly on DOM.
    function fetchRatingFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[@type="application/ld+json"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const sku = scriptTagData ? scriptTagData.replace(/.*sku":"(\d+).*/gm, '$1') : '';
      const gtin = scriptTagData ? scriptTagData.replace(/.*gtin13":"(\d+).*/gm, '$1') : '';
      const url = scriptTagData ? scriptTagData.replace(/.*url":"(\d+)*/gm, '$1') : '';
      addHiddenDiv('added_sku', sku);
      addHiddenDiv('added_gtin', gtin);
      addHiddenDiv('added_url', url);
    }
    fetchRatingFromScript();
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    transform,
    domain: 'fnac.com',
    zipcode: '',
  },
  implementation,
};
