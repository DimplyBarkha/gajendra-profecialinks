
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SE',
    store: 'dyson',
    transform: null,
    domain: 'dyson.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variants_list';
      variantsList.style.display = 'none';

      const variantsTotal = document.querySelectorAll('div.swatches__list a, div.swatches__list div');
      const iterations = variantsTotal.length || 1;
      for (let i = 0; i < iterations; i++) {
        const variantElem = document.createElement('li');
        if (variantsTotal.length) {
          const variantUrl = variantsTotal.length && variantsTotal[i].getAttribute('href') ? 'https://www.dyson.se' + variantsTotal[i].getAttribute('href') : window.location.href;
          const vainantIdElem = variantsTotal.length ? variantsTotal[i].querySelector('img') : null;
          const variantId = vainantIdElem && vainantIdElem.getAttribute('id') ? vainantIdElem.getAttribute('id') : window.location.href;
          variantElem.setAttribute('variant_url', variantUrl);
          variantElem.setAttribute('variant_id', variantId);
        } else {
          const variantUrl = window.location.href;
          const productSkuElem = document.querySelector('div.product-hero__price-top div[data-product-id]');
          const productSku = productSkuElem ? productSkuElem.getAttribute('data-product-id') : window.location.href;
          variantElem.setAttribute('variant_url', variantUrl);
          variantElem.setAttribute('variant_id', productSku);
        }
        variantsList.appendChild(variantElem);
      }
      document.body.appendChild(variantsList);
    });
    await context.extract(variants, { transform });
  },
};
