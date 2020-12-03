const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform: cleanUp,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const productUrl = window.location.href;
      if (productUrl) addElementToDocument('product_url', productUrl);
      const availabilityElem = document.querySelector(' div.product-detail button[title="Add to Bag"]');
      const availability = availabilityElem ? 'In stock' : 'Out of Stock';
      if (availability) addElementToDocument('availability', availability);
    });

    await context.extract(productDetails, { transform });
  },
};
