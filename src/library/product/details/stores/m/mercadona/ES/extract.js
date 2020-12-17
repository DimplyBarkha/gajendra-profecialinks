const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
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
    await context.waitForSelector('.private-product-detail');
    await context.evaluate(() => {
      function addHiddenDiv (className, content, node) {
        const newDiv = document.createElement('div');
        newDiv.className = className;
        newDiv.textContent = content;
        newDiv.style.display = 'none';

        node.appendChild(newDiv);
      }

      const currentProduct = document.querySelector('.private-product-detail__content');
      const headLinesOfProduct = document.querySelectorAll('.headline1-r');
      const pricePerUnit = headLinesOfProduct[headLinesOfProduct.length - 1].textContent;
      const packSize = headLinesOfProduct[headLinesOfProduct.length - 2]
        .textContent
        .match(/\d{0,} ud./);

      if (currentProduct) {
        if (packSize) {
          const size = packSize[0].replace(/[^0-9]/g, '');
          addHiddenDiv('helper-pack-size', size, currentProduct);
        } else {
          addHiddenDiv('helper-pack-size', 'null', currentProduct);
        }
        addHiddenDiv('helper-product-url', location.href, currentProduct);
        addHiddenDiv('price-per-unit', pricePerUnit, currentProduct);
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
