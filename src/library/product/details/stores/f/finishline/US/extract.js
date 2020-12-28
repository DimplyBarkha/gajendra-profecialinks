const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'finishline',
    transform: transform,
    domain: 'finishline.com',
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

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
          return result;
        }
      };

      const description1 = getXpath("//div[@class = 'row column mt-1']/h1/text()", 'nodeValue');
      const description2 = getXpath("//div[@class = 'row column mt-1']/h1/@data-vendor", 'nodeValue');
      const description = description2 + ' ' + description1;
      addElementToDocument('description', description);

      const alternateImages = getAllXpath("//div[@id='productImageLayout']//img/@src", 'nodeValue');
      if (alternateImages != null) {
        addElementToDocument('alternateImages', alternateImages.join('|'));
      }

      const altImageCount = getAllXpath("//*[@id='productImageLayout']//div/@data-thumb", 'content');
      if (altImageCount != null) {
        addElementToDocument('altImageCount', (altImageCount.length) - 1);
      }
      const additionalDescBulletInfo = document.querySelectorAll('#productDescription ul li');
      if (additionalDescBulletInfo != null) {
        addElementToDocument('addEelementBullentCount', additionalDescBulletInfo.length);
      }

      const skuNumnber = getXpath("//meta[@name='Keywords']/@content", 'nodeValue');
      console.log('skuNumnber ==' + skuNumnber);
      if (skuNumnber != null) {
        var sku = skuNumnber.split(',');
        var skuNum = sku[1] + '-' + sku[2];
        addElementToDocument('sku', skuNum);
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
    await context.extract(productDetails, { transform: transformParam });
  },
};
