
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

      // xpath for description
      const featureDescInfoXpath = "//div[@class='features-container form-group']";
      const featureDescInfo = getAllXpath(featureDescInfoXpath, 'innerText');
      const tabDescInfoXpath = "//div[@class='product-info-description']";
      const tabDescInfo = getAllXpath(tabDescInfoXpath, 'innerText');
      let finalDescInfo;
      finalDescInfo = featureDescInfo + '||' + tabDescInfo;

      finalDescInfo = finalDescInfo.replace('\n', '||');
      addElementToDocument('added_descriptionText', finalDescInfo);

      // xpath for specificationValue
      const specifictionXpath = '//div[@class="product-info-description"]/ul[3]';
      const specificationValue = getAllXpath(specifictionXpath, 'innerText');

      specificationValue.forEach(function (element) {
        const specArray = element.split('\n');

        var i;
        for (i = 0; i < specArray.length; i++) {
          if (specArray[i].includes('Weight')) {
            const weight = specArray[i].replace('Weight:', '');

            addElementToDocument('weightValue', weight);
          }
          if (specArray[i].includes('in') || specArray[i].includes('cm')) {
            const dimensions = specArray[i].replace('Dimensions (L × W × H): ', '');

            addElementToDocument('dimensionValue', dimensions);
          }
        }
      });

      // xpath for colorValue
      const colorXpath = '//div[@class="product-info-description"]//ul//li[position()=1]';
      let colorValue = getXpath(colorXpath, 'innerText');
      console.log('My colorValue', colorValue);
      if (colorValue !== null && colorValue.length > 0 && colorValue.includes('Colour')) {
        colorValue = colorValue.replace('Colour:', '');
        addElementToDocument('colorValue', colorValue);
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
    await context.extract(productDetails);
  },
};
