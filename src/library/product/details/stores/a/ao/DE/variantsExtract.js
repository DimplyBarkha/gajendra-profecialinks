module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    transform: null,
    domain: 'ao.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variant_list';
      variantsList.style.display = 'none';
      const availableVariants = document.querySelectorAll('ul#colour-options-picker > li');
      const iterations = availableVariants.length || 1;

      for (let i = 0; i < iterations; i++) {
        const listItem = document.createElement('li');
        let url;
        let variantId;
        if (availableVariants.length) {
          const variantElem = availableVariants[i];
          url = variantElem.getAttribute('data-product-link') ? `${window.location.hostname}${variantElem.getAttribute('data-product-link')}` : window.location.href;
          variantId = variantElem.getAttribute('data-colour-id') || '';
        } else {
          const idElem = document.querySelector('main[data-colour-id]');
          url = window.location.href;
          variantId = idElem ? idElem.getAttribute('data-colour-id') : '';
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
