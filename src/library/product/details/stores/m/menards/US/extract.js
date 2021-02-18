const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'menards',
    transform: cleanUp,
    domain: 'menards.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
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

      var second = getAllXpath('//meta[@property="og:image"][position()>1]/@content', 'nodeValue');
      if (second.length >= 1){
        var abc = second.join(" || ");
        addElementToDocument('image', abc);
    }
      // @ts-ignore
      // const manufacturer = window.qubitEcProduct[0].product.manufacturer;
      // if (manufacturer != null){
      // addElementToDocument('detail-manufacturer', manufacturer);
      // }

      // @ts-ignore
      // const category = window.qubitEcProduct[0].product.category;
      // if (category != null){
      // addElementToDocument('sub-category', category);
      // }
      

    });
    await context.extract(productDetails);
  },
};
