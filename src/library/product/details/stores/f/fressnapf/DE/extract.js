
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    transform: null,
    domain: 'fressnapf.de',
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
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var alternateimg = getAllXpath("(//div[@class='section-content']/div[@class='product-overview']/div/div/div/div/div/div/div/div/div/div/img/@src)", 'nodeValue');
      if (alternateimg != null) {
        if (alternateimg.length > 1) {
          alternateimg.shift();
        }
        for (var i = 0; i < alternateimg.length; i++) {
          addElementToDocument('abc', alternateimg[i]);
        }
      }
    });
    await context.extract(productDetails);
  },
};
