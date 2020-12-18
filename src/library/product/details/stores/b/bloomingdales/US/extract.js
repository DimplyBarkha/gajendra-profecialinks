const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    transform: cleanUp,
    domain: 'bloomingdales.com',
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
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const productUrl = window.location.href;
      if (productUrl !== null) {
        addElementToDocument('product-url', productUrl);
      }
      const availabilityText = getXpath('//button[@class="button add-to-bag"]', 'innerText');
      if (availabilityText != null && (availabilityText.includes('add to bag') || availabilityText.includes('ADD TO BAG'))) {
        addElementToDocument('added_availabilityText', 'In Stock');
      } else {
        addElementToDocument('added_availabilityText', 'Out of Stock');
      }
      const description = getXpath('//p[@class="c-margin-bottom-3v"]', 'innerText');
      const skuNumber = getXpath('//ul[@data-auto="product-description-bullets"]//li', 'innerText');
      if (description != null && description.includes('HOW TO USE IT')) {
        const directions = description.split('HOW TO USE IT')[1];
        addElementToDocument('added_directions', 'HOW TO USE IT' + directions);
      }
      if (description != null && description.includes('HOW TO APPLY')) {
        const directions = description.split('HOW TO APPLY')[1];
        addElementToDocument('added_directions2', 'HOW TO APPLY' + directions);
      }
      if (description != null && description.includes('KEY INGREDIENTS')) {
        const directions = description.split('KEY INGREDIENTS')[1];
        addElementToDocument('added_ingredients', 'KEY INGREDIENTS' + directions);
      }
      if (description != null && description.includes('•')) {
        const descriptionBullets = description.split('•');
        addElementToDocument('added_descriptionBullets', descriptionBullets.length);
      }
      if (description != null) {
        const additionalDescription = description + '||' + skuNumber;
        addElementToDocument('added_additionalDescription', additionalDescription);
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    const url = await context.evaluate(async function () {
      return window.location.href;
    });
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('productUrl' in data[k].group[i]) {
          data[k].group[i].productUrl[0].text = url;
        }
        if ('imageZoomFeaturePresent' in data[k].group[i] && data[k].group[i].imageZoomFeaturePresent[0].text !== 'No') {
          data[k].group[i].imageZoomFeaturePresent[0].text = 'Yes';
        }
      }
    }
    return data;
  },
};
