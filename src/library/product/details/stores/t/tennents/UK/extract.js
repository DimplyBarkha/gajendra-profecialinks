const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'tennents',
    transform: cleanUp,
    domain: 'new.tennentsdirect.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      const productUrl = window.location.href;
      document.querySelector('body').setAttribute('url', productUrl);

      const addToBasketButton = document.querySelector('a.AddToBasket_Button');
      const isButtonDisabled = addToBasketButton.getAttribute('disabled') === 'disabled';
      document.querySelector('body').setAttribute('availability', isButtonDisabled ? 'Out of stock' : 'In stock');
    });

    var extractedData = await context.extract(productDetails, { transform });

    var alcoholContentField = extractedData[0].group[0].alcoholContent;
    if (alcoholContentField) {
      alcoholContentField[0].text = alcoholContentField[0].text.replace(/%/g, '');
    }

    return extractedData;
  },
};
