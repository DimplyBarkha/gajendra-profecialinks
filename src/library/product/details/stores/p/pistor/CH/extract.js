
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'pistor',
    transform: cleanUp,
    domain: 'pistorone.ch',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const productLink = await context.evaluate(async function () {
      const productDetails = document.querySelector('a[rel="details"]');
      const productDetailsUrl = productDetails ? 'https://www.pistorone.ch' + productDetails.getAttribute('href') : null;
      return productDetailsUrl;
    });
    if (productLink) {
      await context.goto(productLink, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    };

    await context.waitForSelector('div#prod_detail');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const productLink = window.location.href;
      const productUrl = productLink || '';
      if (productUrl) addElementToDocument('productUrl', productUrl);

      const availabilityElem = document.querySelector('button.add_to_basket');
      const availabilityText = availabilityElem ? 'In stock' : 'Out of Stock';
      addElementToDocument('availabilityText', availabilityText);
    });
    return await context.extract(productDetails, { transform });
  },
};
