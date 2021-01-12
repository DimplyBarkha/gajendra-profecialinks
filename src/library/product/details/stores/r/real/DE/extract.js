const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: cleanUp,
    domain: 'real.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async function () {

      function addElementToDocument(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('h1[class="rd-title"]')[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
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

      try {
        // XPATH Data Extraction For Aggregate Rating
        // @ts-ignore
        const aggregateRating = getAllXpath('//span[@class="rd-reviews__total-rating-number"]/text()','nodeValue');
        let FinalaggregateRating = aggregateRating[0].replace(/\s\s+/g, '');
        addElementToDocument('addedAggregateRating', FinalaggregateRating.split(' ')[0]);

      } catch (error) {

      }

      try {
        // @ts-ignore
        const sku = window.location.href;
        addElementToDocument('sku', sku.replace(/([A-Za-z])|[^\w\s]/gi, ""));
      } catch (error) {

      }

      
      try {
        const price = getAllXpath('//div[@class="rd-buybox__price"]/text()', 'nodeValue');
        const cents = getAllXpath('//div[@class="rd-buybox__price"]/@cents', 'nodeValue');
        const finalPrice = price[0].replace(/\s|[,]/g, '');
        addElementToDocument('price', '€ ' + finalPrice + ',' + cents);
      } catch (error) {

      }

      try {
        // @ts-ignore
        let description = document.querySelector('div[class="rd-product-description__top-accordion-content-description"]').innerText
        description = description.replace(/\s/g, ' ');
        description = description.replace(/\s\s+/g, ' ');
        addElementToDocument('description', description);
      } catch (error) {

      }
    });
    return await context.extract(productDetails, { transform });
  },
};
