
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    transform: null,
    domain: 'larebajavirtual.com',
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
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var price = getXpath("(//span[@class='ahora'])[1]/text() | //section[@class='product_detail']/div[@class='container']//div[@class='descripciones']/div[2]/div/div[@class='subtotal']/span/span/text()", 'nodeValue');
      if (price != null) {
        price = price.replace('.', ',');
        addElementToDocument('price', price);
      }
      var variant = getAllXpath("//div[@class='sep-dashed']/label/text()", 'nodeValue');
      if (variant != null) {
        var ab = variant.join(' | ');
        addElementToDocument('variant', ab);
      }
    });
    await context.extract(productDetails);
  },
};
