
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

      const pricePerUnit = document.evaluate('//th[contains(text(), "Preis")]//following-sibling::td/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const pricePerUnitText = pricePerUnit ? pricePerUnit.textContent.trim() : null;
      const unitPrice = pricePerUnitText && pricePerUnitText.match(/[\d.,]+/) ? pricePerUnitText.match(/[\d.,]+/)[0] : '';
      const unit = pricePerUnitText ? pricePerUnitText.replace(/[\d.,]+\//, '') : '';
      if (unitPrice) addElementToDocument('unitPirceValue', unitPrice);
      if (unit) addElementToDocument('unitValue', unit);

      const availabilityElem = document.querySelector('button.add_to_basket');
      const availabilityText = availabilityElem ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availabilityText', availabilityText);
    });
    return await context.extract(productDetails, { transform });
  },
};
