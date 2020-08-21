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

    function fetchIDFromScript () {
      const scriptTagSelector = document.querySelector('script[type="application/ld+json"]');
      const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
      let scriptTagJSON = '';
      try {
        scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        scriptTagJSON = '';
      }
      const productList = scriptTagJSON ? scriptTagJSON.mainEntity ? scriptTagJSON.mainEntity[0] ? scriptTagJSON.mainEntity[0].itemListElement : '' : '' : '';
      const skuArray = productList.map(productItem => productItem.item.sku);
      return skuArray;
    }

    function feth
    
    fetchIDFromScript();
    // Adding search url to DOM
    const searchURL = window.location.href;
    addHiddenDiv('added_search_url', searchURL);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'tsc',
    transform,
    domain: 'tsc.ca',
    zipcode: '',
  },
  implementation,
};
