const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    transform: transform,
    domain: 'komus.ru',
    zipcode: '',
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {      
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes("NoName")) {
            var temp = data[index].replace("NoName", "");
          } else {
            temp = data[index];
          }
          addElementToDocument('altImage1', temp);
        }
      };
      var backgroundURL1 = getAllXpath('//div[@itemprop="brand"]/span/text()', 'nodeValue');
      sliceURL1(backgroundURL1);
      const aggregateRating = document.querySelectorAll('div[class="b-rating__full"]')
      for (let k = 0; k < aggregateRating.length; k++) {
        let singleRating = aggregateRating[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1)
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addElementToDocument('aggregateRating', singleRating);
      }
      document.getElementById('certificatesTabLink').click();
      document.getElementById('reviewsTabLink').click();
      await new Promise(r => setTimeout(r, 6000));

    });
    return await context.extract(productDetails, { transform });
  },
};