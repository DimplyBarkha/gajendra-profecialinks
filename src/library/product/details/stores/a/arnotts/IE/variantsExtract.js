
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform: null,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variants_list';
      variantsList.style.display = 'none';

      const variantsSize = document.querySelectorAll('select.variation-select option[data-lgimg]');
      const variants = document.querySelectorAll('ul.swatches.color li a[href]');
      if (variants.length && !variantsSize.length) {
        const iterations = variants.length || 1;
        for (let i = 0; i < iterations; i++) {
          const elem = document.createElement('li');
          const url = variants.length ? variants[i].getAttribute('href') : window.location.href;
          const id = url.match(/pid=(.*)/) ? url.match(/pid=(.*)/)[1] : '';
          elem.setAttribute('variant_url', url);
          elem.setAttribute('variant_id', id);
          variantsList.appendChild(elem);
        }
      }
      if (!variants.length && variantsSize.length) {
        const iterations = variantsSize.length || 1;
        for (let i = 0; i < iterations; i++) {
          const elem = document.createElement('li');
          const url =
          variantsSize.length && variantsSize[i].getAttribute('value') ? variantsSize[i].getAttribute('value') : window.location.href;
          const id = url.match(/pid=(.*)/) ? url.match(/pid=(.*)/)[1] : '';
          elem.setAttribute('variant_url', url);
          elem.setAttribute('variant_id', id);
          variantsList.appendChild(elem);
        }
      }
      document.body.appendChild(variantsList);
    });
    await context.extract(variants);
  },
};
