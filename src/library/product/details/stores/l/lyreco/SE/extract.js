
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'lyreco',
    transform: null,
    domain: 'lyreco.com',
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
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      //alternate image
      var altimg = getAllXpath('//ul[@class="product_miniature_cms float jcarousel-list jcarousel-list-vertical"]/li[position()>1]/a/div/@style', 'nodeValue');
      var alt = []
      if (altimg != null) {
        for (let i = 0; i < altimg.length; i++) {
          var j = altimg[i].slice(95, -3);
          j = j.replace("wid=66", "wid=300");
          j = j.replace("hei=66", "wid=300");
          alt.push(j);
        }
        addElementToDocument('alt', alt);
      }
    });
    await context.extract(productDetails);
  },
};

