const { transform } = require('./variantFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
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
    try {
      const colorVariantSelector = document.querySelector('div.colorVariant');
      const sizeSelector = document.querySelector('ul#sizeOptions');
      // @ts-ignore
      if (!(colorVariantSelector || sizeSelector)) {
        const variantId1 = prod_details_array.prod_id;
        addElementToDocument('added_variantId1', variantId1);
        const variantUrl1 = window.location.href;
        addElementToDocument('added_variantUrl1', variantUrl1);
      }
    } catch (error) {
      console.log('variants are present....');
    }
  });
  return await context.extract(variants, { transform });
}
