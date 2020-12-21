const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform,
    domain: 'flaconi.de',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async (parentInput) => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const skusList1 = document.querySelectorAll('ul[id="makeup-color-list"] li a');
    const skusList2 = document.querySelectorAll('ul[class*="product-list"] li');
    let skus;
    if (skusList1 && skusList1.length) {
      skus = skusList1;
    } else {
      skus = skusList2;
    }
    const url = window.location.href;
    for (let index = 0; index < skus.length; index++) {
      // @ts-ignore
      const element = skus[index].getAttribute('data-sku');
      addElementToDocument('pd_variantid', element);
      addElementToDocument('pd_variantUrl', url + '#sku=' + element);
    }
  });
  return await context.extract(variants, { transform });
}
