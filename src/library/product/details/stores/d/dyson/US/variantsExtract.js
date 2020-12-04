const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'dyson',
    transform: cleanUp,
    domain: 'dyson.com',
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
        const variantUrl = variantsTotal.length && variantsTotal[i].getAttribute('href') ? 'https://www.dyson.com' + variantsTotal[i].getAttribute('href') : window.location.href;
        variantElem.setAttribute('variant_url', variantUrl);

        variantsList.appendChild(variantElem);
      }
      document.body.appendChild(variantsList);
    });
    await context.extract(variants, { transform });
  },
};
