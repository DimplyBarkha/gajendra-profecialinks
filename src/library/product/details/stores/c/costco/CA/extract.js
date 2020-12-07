const { transform } = require('../sharedTransform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform,
    domain: 'costco.ca',
    zipcode: 'M5V 2A5',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const descEl = document.querySelector('#product_tabs .product-info-description');

      if (descEl) {
        const featureBullets = descEl.querySelectorAll('li');

        for (const el of featureBullets) {
          const newEl = document.createElement('import-feature');
          newEl.innerText = el.innerText;
          document.body.appendChild(newEl);
          el.remove();
        }

        const newDescEl = document.createElement('import-description');
        newDescEl.innerText = descEl.innerText;
        document.body.appendChild(newDescEl);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
