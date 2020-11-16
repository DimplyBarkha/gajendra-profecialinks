const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'baligam',
    transform: cleanUp,
    domain: 'baligam.co.il',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      // const getAllXpath = (xpath, prop) => {
      //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      //   const result = [];
      //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
      //     const element = nodeSet.snapshotItem(index);
      //     if (element) result.push(prop ? element[prop] : element.nodeValue);
      //     return result;
      //   }
      // };
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const retainAlphaNumbericString = (inputString) => {
        if (inputString != null) {
          return inputString.replace(/[^a-zA-Z0-9/.]/g, '');
        }
      };
      const shippingWeight = getXpath("//ul//li//div//span/text()[contains(.,'משקל כולל:' )] | //ul//li//div//span/text()[contains(.,'משקל:')]", 'nodeValue');
      const weight = shippingWeight;
      addElementToDocument('added_shipping_weight', retainAlphaNumbericString(weight));
      const retainAColor = (inputString) => {
        if (inputString != null) {
          return inputString.replace('צבע:', '');
        }
      };
      const prodColor = getXpath("//div//span/text()[contains(.,'צבע:' )]", 'nodeValue');
      const color = prodColor;
      addElementToDocument('added_color', retainAColor(color));

      // const additionalDescHeader = getXpath("//div[@class='content']//div//text()", 'nodeValue');
      // const descHader = additionalDescHeader;
      // addElementToDocument('added_addiadditionalDescHeader', descHader);
      // const additionalDesc = document.querySelectorAll('.content ul');

      const additionalDescBulletInfo = document.querySelectorAll('.content ul li');
      console.log('additionalDescBulletInfo : ' + additionalDescBulletInfo.length);
      additionalDescBulletInfo.forEach((item) => {
        console.log(item);
        addElementToDocument('added_additionalDescBulletInfo', item.textContent);
      });
      addElementToDocument('addEelementBullentCount', additionalDescBulletInfo.length);

      let specification = '';
      additionalDescBulletInfo.forEach((item) => {
        console.log(item);
        if (item.textContent.includes('צבע') || item.textContent.includes('ליטר/שנייה') ||
          item.textContent.includes('הספק מנוע') || item.textContent.includes('כבל חשמל באורך') ||
          item.textContent.includes('משקל') || item.textContent.includes('מידות') ||
          item.textContent.includes('קוטר')) {
          specification = specification + item.textContent + '||';
        }
      });
      console.log('specification ' + specification);
      addElementToDocument('addedSpecificationDetails', specification);

      const jsonStr = getXpath("//script[@id='opportunity-schema']/text()", 'nodeValue');
      let available;
      if (jsonStr) {
        const jsonObj = JSON.parse(jsonStr);
        console.log('jsonObj' + jsonObj.offers.availability);
        if (((jsonObj.offers.availability).includes(['InStock']))) {
          available = 'InStock';
        } else {
          available = 'OutOfStock';
        }
      }
      console.log('available ' + available);
      addElementToDocument('addedAvailibility', available);

      const priceCurrency = getXpath("//span[@class = 'currency-symbol']//text()", 'nodeValue');
      const price = getXpath("//input[@id='txtInitialPrice']/@value", 'nodeValue');
      const totalPrice = priceCurrency + price;
      addElementToDocument('addedtotalPrice', totalPrice);
      console.log('totalPrice ' + totalPrice);
      const elements = document.querySelectorAll('.content ul > li:nth-child(2)');
      console.log('elements ' + elements.length);

      elements.forEach((item) => {
        console.log('item ' + item.textContent);
        // ddElementToDocument('added_additionalDescBulletInfo', item.textContent);
      });

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
