const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
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
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="b-product-list__item__picture"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
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
          if (data[index].includes(" ")) {
            var temp = data[index].replace(" ", "");
          } else {
            temp = data[index].replace("", "");
          }
          addHiddenDiv('altImage1', temp, index);
        }
      };
      var backgroundURL1 = getAllXpath('//div[@class="b-product-list__price"]//a//span[1]/text()', 'nodeValue');
      sliceURL1(backgroundURL1);
    });
    return await context.extract(productDetails, { transform });
  },
};
