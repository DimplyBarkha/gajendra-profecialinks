const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const addUrl = async function (context) {
    await context.evaluate(async function () {
      const url = document.location.href;
      const productList = document.querySelectorAll('.product-item');
      productList.forEach(product => product.setAttribute('searchurl', url));
    });
  };

  await addUrl(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform: transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation,
};
