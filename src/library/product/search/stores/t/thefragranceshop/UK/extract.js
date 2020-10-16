async function implementation(inputs, parameters, context, dependencies) {
  const {
    transform,
  } = parameters;
  const {
    productDetails,
  } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  await context.evaluate(() => {
    function addProp(selector, iterator, propName, value) {
      document
        .querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    const allProducts = document.querySelectorAll(
      'div.item-sku',
    );
    for (let i = 0; i < allProducts.length; i++) {
      addProp(
        'div.item-sku',
        i,
        'rankorganic',
        `${i + 1}`,
      );
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  return await context.extract(productDetails, {
    transform,
  });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    transform: null,
    domain: 'thefragranceshop.co.uk',
    zipcode: '',
  },
  implementation,
};