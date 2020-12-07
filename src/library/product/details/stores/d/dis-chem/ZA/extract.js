module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'dis-chem',
    transform: null,
    domain: 'dischem.co.za',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    context.evaluate(async () => {
      const meta = document.querySelector('meta[itemprop="availability"]');
      if (meta.getAttribute('content') === 'https://schema.org/InStock') {
        meta.setAttribute('content2', 'In Stock');
      } else {
        meta.setAttribute('content2', 'Out Of Stock');
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
