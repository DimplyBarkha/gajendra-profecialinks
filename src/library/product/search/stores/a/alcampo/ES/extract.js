async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(() => {
    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    const manufacturer = document.querySelectorAll('.marca');
    const price = document.querySelectorAll('.priceContainer');
    let priceIteration;
    let manufacturerIteration;

    // there are same number of products so i < price.length will work for i < manufacturer.length

    for (let i = 1; i < price.length; i++) {
      priceIteration = price[i].textContent;

      priceIteration = priceIteration.replace(/\s\s+/g, '');
      priceIteration = priceIteration.replace('Unidad', '');

      manufacturerIteration = manufacturer[i].textContent;
      manufacturerIteration.replace(/\s\s+/g, '');

      addProp('.priceContainer', i, 'price', priceIteration);
      addProp('.marca', i, 'manufacturer', manufacturerIteration);
    };
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails);
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation,
};
