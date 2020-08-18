const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform,
    domain: 'johnlewis.com',
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
      if (document.querySelector('a.product-detail__brand-link')) {
        const brandLink = document.querySelector('a.product-detail__brand-link').href;
        addHiddenDiv('brandLink', brandLink);
      }

      const response = document.querySelector('script') ? JSON.parse(document.querySelector("script[type='application/ld+json']").innerText) : null;
      if (response) {
        const brandText = response.brand.name;
        const mpc = response.mpn;
        const image = response.image;
        const sku = response.sku;
        const productId = 'p' + response.productId;
        addHiddenDiv('brandText', brandText);
        addHiddenDiv('mpc', mpc);
        addHiddenDiv('image', image);
        addHiddenDiv('sku', sku);
        addHiddenDiv('productId', productId);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
