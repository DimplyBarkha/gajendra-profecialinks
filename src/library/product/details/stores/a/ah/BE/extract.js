const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    transform,
    domain: 'ah.be',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.waitForSelector('#start-of-content');
    // Check if cookies pop-up appeared
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('#cookie-popup'));
    });
    if (doesPopupExist) {
      await context.click('#accept-cookies');
    }
    //
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('variantCount', document.getElementsByClassName('product-recommendations_link__1b2lR').length);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
