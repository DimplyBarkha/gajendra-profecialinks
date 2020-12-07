const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'billa',
    transform: transform,
    domain: 'billa.at',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // @ts-ignore
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        // @ts-ignore
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      // // Single Pipe Concatenation
      // const pipeSeparatorSingle = (id, data) => {
      //   var singleSeparatorText = data.join(' | ');
      //   addElementToDocument(id, singleSeparatorText);
      // };
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };
      // added size
      // var sizeText = getXpath('//h1[@data-dmid="detail-page-headline-product-title"]/text()', 'nodeValue');
      // if (sizeText != null) {
      //   var sizeValue = sizeText.split(',');
      //   addElementToDocument('addedSize', sizeValue[(sizeValue.length - 1)]);
      // }
      // added additional description
      const additionalDescription = getAllXpath("//div[@class='product-detail__desc-text ul']//p[@itemprop='description']/text() | //div[@class='product-detail__desc-text ul']/li/text()", 'nodeValue');
      // addElementToDocument('addedAdditionalDescription', additionalDescription);
      if (additionalDescription !== null && additionalDescription.length > 0) {
        pipeSeparatorDouble('addedAdditionalDescription', additionalDescription);
      }
      // added weightNet & weightGross
      var netWeightText = getXpath("//div[@ng-include='includeTemplate.url']/table//tbody//div[contains(text(),'Nettogehalt')]", 'innerText');
      console.log('netWeightText:', netWeightText);
      if (netWeightText != null) {
        var netWeightTextVal = netWeightText.split(':');
        console.log('netWeightTextVal:', netWeightTextVal);
        addElementToDocument('addedNetWeight', netWeightTextVal[(netWeightTextVal.length - 1)]);
      }
      var grossWeightText = getXpath("//div[@ng-include='includeTemplate.url']/table//tbody//div[contains(text(),'Bruttogewicht')]", 'innerText');
      console.log('grossWeightText:', grossWeightText);
      if (grossWeightText != null) {
        var grossWeightTextVal = grossWeightText.split(':');
        console.log('grossWeightTextVal:', grossWeightTextVal);
        addElementToDocument('addedGrossWeight', grossWeightTextVal[(grossWeightTextVal.length - 1)]);
      }
      // added availability
      const availabilityStatusUrl = getXpath("//link[@itemprop='availability']/@href", 'nodeValue');
      var availabilityStatusValue = 'Out of Stock';
      if (availabilityStatusUrl != null && availabilityStatusUrl.includes('InStock')) {
        availabilityStatusValue = 'In stock';
      }
      addElementToDocument('added_availabilityText', availabilityStatusValue);
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
