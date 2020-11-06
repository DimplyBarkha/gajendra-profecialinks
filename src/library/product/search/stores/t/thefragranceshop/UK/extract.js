const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  await context.evaluate(() => {
    const newElement = document.createElement('a');
    newElement.setAttribute('class', 'page-link');
    newElement.href = window.location.href;
    if (newElement.href) {
      document.body.appendChild(newElement);
    }
    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    const allProducts = document.querySelectorAll('div.item-sku');
    for (let i = 0; i < allProducts.length; i++) {
      addProp('div.item-sku', i, 'rankorganic', `${i + 1}`);
    }
  });

  return await context.extract(productDetails, {
    transform,
  });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    transform: transform,
    domain: 'thefragranceshop.co.uk',
    zipcode: '',
  },
  implementation,
};
