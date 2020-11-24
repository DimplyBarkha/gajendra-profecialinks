const { cleanup } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'sbermarket',
    transform: cleanup,
    domain: 'sbermarket.ru/metro',
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

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const text = element ? element.textContent : null;
        return text;
      };

      const productUrl = window.location.href;
      const availability = getEleByXpath('//link[@itemprop="availability"]/@href[contains(., "InStock")]');
      const availabilityText = availability ? 'In stock' : 'Out of Stock';
      const servingSize = document.querySelector('h3.nutrition__title');
      const servingSizeValue = servingSize ? servingSize.textContent.replace(/\W+\s+([\d,.]+)\s+\W+/, '$1') : '';
      const servingSizeUom = servingSize ? servingSize.textContent.replace(/\W+\s+[\d,.]+\s+(\W+)/, '$1') : '';
      const fatElement = getEleByXpath('//div[@class="product-property__name"]/strong[contains(text(),"Жиры")]/parent::div/following-sibling::div[@class="product-property__value"]');
      const totalFatValue = fatElement ? fatElement.replace(/([,\d.]+)\s+\W+/, '$1') : '';
      const totalFatUom = fatElement ? fatElement.replace(/[\d,.]+\s+(\W+)/, '$1') : '';
      const totalCarbElement = getEleByXpath('//div[@class="product-property__name"]/strong[contains(text(),"Углеводы")]/parent::div/following-sibling::div[@class="product-property__value"]');
      const totalCarbValue = totalCarbElement ? totalCarbElement.replace(/([,\d.]+)\s+\W+/, '$1') : '';
      const totalCarbUom = totalCarbElement ? totalCarbElement.replace(/[\d,.]+\s+(\W+)/, '$1') : '';
      const proteinElement = getEleByXpath('//div[@class="product-property__name"]/strong[contains(text(),"Белки")]/parent::div/following-sibling::div[@class="product-property__value"]');
      const proteinValue = proteinElement ? proteinElement.replace(/([,\d.]+)\s+\W+/, '$1') : '';
      const proteinUom = proteinElement ? proteinElement.replace(/[\d,.]+\s+(\W+)/, '$1') : '';

      addElementToDocument('totalFatValue', totalFatValue);
      addElementToDocument('totalFatUom', totalFatUom);
      addElementToDocument('totalCarbValue', totalCarbValue);
      addElementToDocument('totalCarbUom', totalCarbUom);
      addElementToDocument('proteinValue', proteinValue);
      addElementToDocument('proteinUom', proteinUom);
      addElementToDocument('servingSizeValue', servingSizeValue);
      addElementToDocument('servingSizeUom', servingSizeUom);
      addElementToDocument('availabilitytext', availabilityText);
      if (productUrl) addElementToDocument('producturl', productUrl);
    });
    await context.extract(productDetails, { transform });
  },
};
