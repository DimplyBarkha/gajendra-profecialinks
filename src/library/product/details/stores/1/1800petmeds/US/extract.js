const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: '1800petmeds',
    transform: transform,
    domain: '1800petmeds.com',
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

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
          return result;
        }
      };

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const additionalDescBulletInfo = document.querySelectorAll('#productInfo ul li');
      console.log('additionalDescBulletInfo : ' + additionalDescBulletInfo.length);
      additionalDescBulletInfo.forEach((item) => {
        console.log(item);
      });
      addElementToDocument('addEelementBullentCount', additionalDescBulletInfo.length);

      const variantInfo = getAllXpath("//div[@class='pack ']/@data-attr-value", 'nodeValue');
      console.log('variantInfo ' + variantInfo);
      if (variantInfo != null) {
        addElementToDocument('variantPackInfo', variantInfo.join('|'));
      }

      const jsonStr = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      let combinedVvariantInfo = '';
      if (jsonStr) {
        const jsonObj = JSON.parse(jsonStr);
        var val = 0;
        console.log('keyObject ' + JSON.stringify(jsonObj.offers));
        jsonObj.offers.forEach(element => {
          if (val === 0) {
            combinedVvariantInfo = combinedVvariantInfo + element.name;
          }
          val++;
        });
        console.log('name' + combinedVvariantInfo);
      }
      addElementToDocument('varaintInfo', combinedVvariantInfo);

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
