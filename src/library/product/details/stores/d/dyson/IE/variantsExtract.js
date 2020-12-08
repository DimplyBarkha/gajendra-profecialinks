
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IE',
    store: 'dyson',
    transform: null,
    domain: 'dyson.ie',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variant_list';
      variantsList.style.display = 'none';
      const availableVariants = document.querySelectorAll('div.product-hero div.swatches > div.swatches__list > *');
      const iterations = availableVariants.length || 1;

      for (let i = 0; i < iterations; i++) {
        const listItem = document.createElement('li');
        let url;
        let variantId;
        if (availableVariants.length) {
          const variantElem = availableVariants[i];
          url = variantElem.getAttribute('href') ? `https://www.dyson.ie${variantElem.getAttribute('href')}` : window.location.href;
          variantId = variantElem.querySelector('img').getAttribute('id');
        } else {
          const idElem = document.querySelector('div.product-hero__price div[data-product-id]');
          url = window.location.href;
          variantId = idElem ? idElem.getAttribute('data-product-id') : '';
        }

        listItem.setAttribute('variant_id', variantId);
        listItem.setAttribute('variant_url', url);
        variantsList.appendChild(listItem);
      }
      document.body.appendChild(variantsList);
    });
    await context.extract(variants);
  },
};
