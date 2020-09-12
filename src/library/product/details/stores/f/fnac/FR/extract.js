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

    function fetchDetailsFromScript () {
      const scriptTagSelectorLD = document.querySelector('script[type="application/ld+json"]');
      const scriptTagDataLD = scriptTagSelectorLD ? scriptTagSelectorLD.innerText : '';
      let scriptTagJSONLD = '';
      try {
        scriptTagJSONLD = scriptTagDataLD ? JSON.parse(scriptTagDataLD) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        scriptTagJSONLD = '';
      }
      let sku = scriptTagJSONLD ? scriptTagJSONLD.sku ? scriptTagJSONLD.sku : '' : '';
      // If sku is blank then taking product id as sku
      if (!sku) {
        const skuSelector = document.querySelector('div[class*="f-productPage"]');
        sku = skuSelector ? skuSelector.getAttribute('data-prid') : '';
      }
      addHiddenDiv('added_sku', sku);
    }
    fetchDetailsFromScript();
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
