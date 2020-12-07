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

      // Method to retrieve json content of a Single Node
      const findScriptValue = (xpath) => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const textContent = element.textContent;
        return textContent;
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
      // added aggregateRating
      // var aggregateRatingPath = getXpath("//span[contains(@class,'rating__title-overlay absolute')]/@title", 'nodeValue');
      // if (aggregateRatingPath != null) {
      //   var aggregateRatingValue = aggregateRatingPath.split(':');
      //   addElementToDocument('addedAggregateRating', aggregateRatingValue[(aggregateRatingValue.length - 1)]);
      // }

      addElementToDocument('added_productsPerPage', 0);
      const aggregateRatingPath = getXpath("//span[contains(@class,'rating__title-overlay absolute')]/@title", 'nodeValue');
      // eslint-disable-next-line quotes
      // console.log(">>>>>>>>>>" + aggregateRatingPath);
      if (aggregateRatingPath != null) {
        var aggreagetRatingVal = aggregateRatingPath.split(':');
        var aggregateRatingVal2 = aggreagetRatingVal[1].split('/');
        console.log('aggregate_value' + aggregateRatingVal2);
        var aggregateRatingVal3 = aggregateRatingVal2[0].trim();
        addElementToDocument('added_aggregateRating', aggregateRatingVal3.replace('.', ','));
      }
      // added additional description
      const additionalDescription = getAllXpath("//div[@class='product-detail__desc-text ul']//p[@itemprop='description']/text() | //div[@class='product-detail__desc-text ul']/li/text()", 'nodeValue');
      // addElementToDocument('addedAdditionalDescription', additionalDescription);
      if (additionalDescription !== null && additionalDescription.length > 0) {
        pipeSeparatorDouble('addedAdditionalDescription', additionalDescription);
      }

      // added image360present
      const image360PresentPath = getXpath("//li[@class='product-detail__media-thumbnail-360']/@class", 'nodeValue');
      var image360PresentValue = 'No';
      if (image360PresentPath != null && image360PresentPath.includes('product-detail__media-thumbnail-360')) {
        image360PresentValue = 'Yes';
      }
      addElementToDocument('added_image30PresentText', image360PresentValue);
      // added additional field values
      var jsonStr = findScriptValue("//div[contains(@data-dd-product-detail,'eanCodes')]/@data-dd-product-detail");
      // console.log('===========' + jsonStr);
      // var sku = '';
      if (jsonStr != null) {
        var obj = JSON.parse(jsonStr);
        console.log(obj.eanCodes);
        addElementToDocument('eanCodes', obj.eanCodes);
        console.log(obj.foodInformation[0].countryOrigins[0]);
        addElementToDocument('countryOfOrigin', obj.foodInformation[0].countryOrigins[0]);
        addElementToDocument('added_servingSize', obj.foodInformation[0].nutritions[1].relationValue);
        addElementToDocument('added_servingSizeUom', obj.foodInformation[0].nutritions[1].unit);
        // if (obj.measurements.type != null && (obj.measurements.type === 'Nettogehalt')) {
        //   addElementToDocument('added_grossWeight', obj.measurements.value);
        // }
        // if (obj.measurements.type != null && (obj.measurements.type === 'Bruttogewicht')) {
        //   addElementToDocument('added_netWeight', obj.measurements.value);
        // }
      }
      // added weightNet & weightGross
      var netWeightText = getXpath("//div[@ng-include='includeTemplate.url']/table//tbody//div[contains(text(),'Nettogehalt')]", 'innerText');
      // console.log('netWeightText:', netWeightText);
      if (netWeightText != null) {
        var netWeightTextVal = netWeightText.split(':');
        // console.log('netWeightTextVal:', netWeightTextVal);
        var netWeightValue = netWeightTextVal[1].trim();
        addElementToDocument('addedNetWeight', netWeightValue);
      }
      var grossWeightText = getXpath("//div[@ng-include='includeTemplate.url']/table//tbody//div[contains(text(),'Bruttogewicht')]", 'innerText');
      // console.log('grossWeightText:', grossWeightText);
      if (grossWeightText != null) {
        var grossWeightTextVal = grossWeightText.split(':');
        // console.log('grossWeightTextVal:', grossWeightTextVal);
        var grossWeightValue = grossWeightTextVal[1].trim();
        addElementToDocument('addedGrossWeight', grossWeightValue);
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
