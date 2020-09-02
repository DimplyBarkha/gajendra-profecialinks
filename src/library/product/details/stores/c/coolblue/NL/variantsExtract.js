
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    await context.evaluate(async function () {
      //  if no variants available , pull sku and product page url
      let sku = document.querySelector('main#main-content').getAttribute('data-product-id');
      const url = document.querySelector('head > link:nth-child(7)').href;
      const variantAvailable = document.querySelector('div.selectable-card input');
      if (!variantAvailable && sku) {
        console.log('variants not available, appending SKU');
        sku = `collection-item-${sku}`;
        const div = document.createElement('div');
        div.className = 'selectable-card';
        const getInput = document.createElement('input');
        getInput.id = sku;
        div.appendChild(getInput);
        document.body.appendChild(div);
        getInput.setAttribute('value', url);
        console.log('variants not available________appended SKU');
      }
    });
    await context.extract(variants);
  },
};
