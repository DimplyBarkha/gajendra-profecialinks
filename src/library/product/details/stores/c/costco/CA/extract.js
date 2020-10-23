
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform: null,
    domain: 'costco.ca',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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
        }
        return result;
      };

      /*
      const retainAlphaNumbericString = (inputString) => {
        return inputString.replace(/[^a-zA-Z0-9]/g, '');
      }; */

      // Get Single Value XPATH Extraction
      // xpath for colorValue
      const colorXpath = '//div[@class="product-info-description"]//ul//li[position()=1]';
      let colorValue = getXpath(colorXpath, 'innerText');
      console.log('My colorValue', colorValue);
      if (colorValue !== null && colorValue.length > 0 && colorValue.includes('Colour')) {
        colorValue = colorValue.replace('Colour:', '');
        console.log('My colorValue', colorValue);
        addElementToDocument('colorValue', colorValue);
      }

      const specXpath = '//div[@class="product-info-specs body-copy"]//div[@class="row"]//div[@class="col-xs-6 col-md-7 col-lg-8"]';
      const dimenXpath = '//div[@class="product-info-description"]/ul[2]/li';
      const specValue = getAllXpath(specXpath, 'innerText');
      const dimenValue = getAllXpath(dimenXpath, 'innerText');
      console.log('My dimenValue Values', dimenValue);
      console.log('My Specification Values', specValue);
      console.log('My Specification length ', specValue.length);
      specValue.forEach(function (element) {
        console.log('My weightValue element', element);
        console.log('My weightValue element includes kg ', element.includes('kg'));
        if (element.includes('kg')) {
          console.log('My weightValue element kg', element);
          addElementToDocument('weightValue', element);
        }
        if (element.includes('in') || element.includes('cm')) {
          console.log('My dimension element in ', element);
          addElementToDocument('dimensionValue', element);
        } else {
          addElementToDocument('dimensionValue', dimenValue);
        }
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
    await context.extract(productDetails);
  },
};
