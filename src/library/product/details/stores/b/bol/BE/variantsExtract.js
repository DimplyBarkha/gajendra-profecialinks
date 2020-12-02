module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    transform: null,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { variants }) => {
    await context.evaluate(async () => {
      const variantsList = document.createElement('ol');
      variantsList.id = 'added_variants_list';
      variantsList.style.display = 'none';

      const variants = document.querySelectorAll('div[data-test="feature-options"] > a');
      const iterations = variants.length || 1;
      for (let i = 0; i < iterations; i++) {
        const elem = document.createElement('li');
        const url = variants.length ? `https://www.bol.com${variants[i].getAttribute('href')}` : window.location.href;
        const id = url.match(/\/(\w+)\/(\?.+)?$/) ? url.match(/\/(\w+)\/(\?.+)?$/)[1] : '';
        elem.setAttribute('variant_url', url);
        elem.setAttribute('variant_id', id);
        variantsList.appendChild(elem);
      }
      document.body.appendChild(variantsList);
    });
    await context.extract(variants);
  },
};
