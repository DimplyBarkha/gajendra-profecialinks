const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    transform: transform,
    domain: 'thebay.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const response = document.querySelector('script') ? JSON.parse(document.querySelector("script[type='application/ld+json']").innerText) : null;
      if (response) {
        const gtin = response.gtin13;
        const sku = response.sku;
        const mpc = response.mpn;
        addHiddenDiv('gtin', gtin);
        addHiddenDiv('sku', sku);
        addHiddenDiv('mpc', mpc);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
