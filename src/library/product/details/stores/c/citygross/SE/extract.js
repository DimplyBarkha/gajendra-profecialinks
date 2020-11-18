const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'citygross',
    transform: cleanUp,
    domain: 'citygross.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const brand = getXpath('//meta[@itemprop="brand"]//@content', 'nodeValue');
      const title = getXpath('//meta[@property="og:title"]//@content', 'nodeValue');
      if (!title.includes(brand)) {
        const productDescription = brand + ' - ' + title;
        addElementToDocument('added_productDescription', productDescription);
      } else {
        addElementToDocument('added_productDescription', title);
      }
      const description = getXpath('//meta[@name="description"]//@content', 'nodeValue');
      addElementToDocument('added_description', description);
      const variantIdValue = getXpath('//meta[@itemprop="url"]//@content', 'nodeValue');
      if (variantIdValue != null) {
        const variantIdArr = variantIdValue.split('-');
        const variantId = variantIdArr[variantIdArr.length - 1].replace('p', '');
        addElementToDocument('added_variantId', variantId);
      }
      const pricePerUnit = getXpath('//div[@class="push-to-bottom"]//span[@class="grey compare-price"]//text()', 'nodeValue');
      if (pricePerUnit != null) {
        addElementToDocument('added_pricePerUnit', pricePerUnit.split(' ')[2].replace(',', '.'));
        addElementToDocument('added_pricePerUnitUom', pricePerUnit.split(' ')[3]);
      }
      const priceCurrency = getXpath('//meta[@itemprop="priceCurrency"]//@content', 'nodeValue');
      const price = getXpath('//meta[@itemprop="price"]//@content', 'nodeValue');
      addElementToDocument('added_onlinePrice', priceCurrency + price);
      const availabilityText = getXpath('//meta[@itemprop="availability"]//@content', 'nodeValue');
      if (availabilityText != null && availabilityText.includes('InStock')) {
        addElementToDocument('added_availabilityText', 'In Stock');
      } else {
        addElementToDocument('added_availabilityText', 'Out of Stock');
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
