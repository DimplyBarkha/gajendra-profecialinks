const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'mercadona',
    transform,
    domain: 'mercadona.es',
    zipcode: '46008',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('.section');
    await context.evaluate(() => {
      console.log(location.search.replace('?query=', ''));
      function addHiddenDiv (className, content, product) {
        const newDiv = document.createElement('div');
        newDiv.className = className;
        newDiv.textContent = content;
        newDiv.style.display = 'none';

        product.appendChild(newDiv);
      }
      const products = document.querySelectorAll('.product-cell');
      console.log(products);
      products.forEach((product) => {
        addHiddenDiv('position-helper', location.search.replace('?query=', ''), product);
        addHiddenDiv('helper-url', location.href, product);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
