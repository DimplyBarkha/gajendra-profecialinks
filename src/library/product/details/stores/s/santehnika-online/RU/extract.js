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
    await context.click('button[type="submit"]');
    await context.waitForSelector('ul[class*="b-breadcrumb__list"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const unavailabilityInfo = document.querySelector('div[class*=\'row--unavailable\']');
      const availabilityInfo = document.querySelector('div[class*=\'prices__row\']>div[class*=\'buttons\']');
      if (unavailabilityInfo) {
        addElementToDocument('availability', 'Out Of Stock');
      } else if (availabilityInfo) {
        addElementToDocument('availability', 'In Stock');
      }

      // eslint-disable-next-line no-undef
      const productSku = __SD__.cardDelivery.data.item.id;
      if (productSku) {
        addElementToDocument('product_sku', productSku);
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
