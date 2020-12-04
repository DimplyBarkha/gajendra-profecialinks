const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    transform: cleanUp,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variants_list';
      variantsList.style.display = 'none';

      const variantsTotal = document.querySelectorAll('x-wrapper-re-1-3 ul > li a');
      const iterations = variantsTotal.length || 1;
      for (let i = 0; i < iterations; i++) {
        const variantElem = document.createElement('li');
        const variantUrl = variantsTotal.length ? variantsTotal[i].getAttribute('href') : window.location.href;
        const variantId = variantUrl.match(/(\w+-\w+)\.html$/) ? variantUrl.match(/(\w+-\w+)\.html$/)[1] : '';
        variantElem.setAttribute('variant_url', variantUrl);
        variantElem.setAttribute('variant_id', variantId);
        variantsList.appendChild(variantElem);
      }
      document.body.appendChild(variantsList);
    });
    await context.extract(variants, { transform });
  },
};
