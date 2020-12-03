
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    transform: cleanUp,
    domain: 'mytime.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('button#accept-consent-all');
      if (closePopupButton) {
        // @ts-ignore
        closePopupButton.click();
      }
    });

    await context.evaluate(async function () {
      function addElementToDocument (id, value) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const isAvailable = document.querySelector('meta[property="product:availability"]');
      if (isAvailable !== null && isAvailable !== undefined) {
        addElementToDocument('isAvailable', 'In Stock');
      } else addElementToDocument('isAvailable', 'Out of Stock');
    });

    await context.extract(productDetails);
  },
};
