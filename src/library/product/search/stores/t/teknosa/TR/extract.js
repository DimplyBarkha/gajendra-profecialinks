async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const addRanking = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll('.product-item');
      productList.forEach((product, i) => {
        product.setAttribute('rank', i + 1);
      });
    });
  };
  await addRanking(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform: null,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation,
};
