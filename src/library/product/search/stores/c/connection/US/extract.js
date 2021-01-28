const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'connection',
    transform: transform,
    domain: 'connection.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    async function productUrl () {
     function addHiddenDiv (key, value) {
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
      const producturl = getAllXpath("//table[@class='table']/tbody/tr[@class='product-container']/td/div[@class='product-name-list']/a/@href", 'nodeValue');
      console.log('Producturl ==>',producturl);
      for (let a = 0; a < producturl.length; a++) {
        addHiddenDiv('added_producturl', 'https://www.connection.com'+producturl[a]);
        console.log('addedurl ==>','https://www.connection.com'+producturl[a]);
      }
    }
    await context.evaluate(productUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
