const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'santehnika-online',
    transform: cleanUp,
    domain: 'santehnika-online.ru',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const availabilityInfo = document.querySelector('div[class*=\'row--unavailable\']');
      if (availabilityInfo) {
        addElementToDocument('availability', 'Out of stock');
      } else {
        addElementToDocument('availability', 'In stock');
      }

      const productDescription = document.querySelectorAll('ul[class*=\'properties-wrapper\'] > li, div[class*=\'card-product-text\']>ul>li, div[class*=\'card-product-text\'] ');
      if (productDescription.length) {
        for (let i = 0; i < productDescription.length; i++) {
          addElementToDocument('productdescription', productDescription[i].innerText);
        }
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      const characteristicExists = document.evaluate('//span[text()=\'Характеристики\']', document.body,
        null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      if (characteristicExists) {
        document.evaluate('//span[text()=\'Характеристики\']', document.body, null, 9,
          null).singleNodeValue.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      }

      const heightExists = document.evaluate('//div[contains(@class, \'card-specs-group\')]//span[contains(@class, \'item-title-text\')][contains(text(), \'Ширина\')]/../../following-sibling::div[contains(@class, \'item-value\')]',
        document.body, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      const widthExists = document.evaluate('//div[contains(@class, \'card-specs-group\')]//span[contains(@class, \'item-title-text\')][contains(text(), \'Высота\')]/../../following-sibling::div[contains(@class, \'item-value\')]',
        document.body, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      const depthExists = document.evaluate('//div[contains(@class, \'card-specs-group\')]//span[contains(@class, \'item-title-text\')][contains(text(), \'Глубина\')]/../../following-sibling::div[contains(@class, \'item-value\')]',
        document.body, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      let dimensions = '';
      if (heightExists) {
        dimensions += document.evaluate('//div[contains(@class, \'card-specs-group\')]//span[contains(@class, \'item-title-text\')][contains(text(), \'Ширина\')]/../../following-sibling::div[contains(@class, \'item-value\')]',
          document.body, null, 9, null).singleNodeValue.innerText + 'cm ';
      }
      if (widthExists) {
        dimensions += document.evaluate('//div[contains(@class, \'card-specs-group\')]//span[contains(@class, \'item-title-text\')][contains(text(), \'Высота\')]/../../following-sibling::div[contains(@class, \'item-value\')]',
          document.body, null, 9, null).singleNodeValue.innerText + 'cm ';
      }
      if (depthExists) {
        dimensions += document.evaluate('//div[contains(@class, \'card-specs-group\')]//span[contains(@class, \'item-title-text\')][contains(text(), \'Глубина\')]/../../following-sibling::div[contains(@class, \'item-value\')]',
          document.body, null, 9, null).singleNodeValue.innerText + 'cm ';
      }
      if (dimensions) {
        addElementToDocument('productdimensions', dimensions);
      }
    });
    await context.extract(productDetails, { transform });
  },
};
