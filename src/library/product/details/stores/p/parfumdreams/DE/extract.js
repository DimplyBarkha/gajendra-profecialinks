
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: null,
    domain: 'en.parfumdreams.de',
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
      var dec = getAllXpath('(//div[@class="variation-alt-images clearfix"]/div/@data-variation-id | //*[@id="schema-offer"]/div[1]/div/input/@value)', 'nodeValue');
      var str = "";
      if (dec != null) {
        str = dec.join(" | ");
        addElementToDocument('str', str);
      }
      var name = getXpath('//*[@id="schema-offer"]/div[2]/p[2]/text()', 'nodeValue');
      if (name != null) {
        if (name.includes("not available")) {
          name = "Out of Stock";
        } else {
          name = "In Stock";
        }
        addElementToDocument('name', name);
      }
      var perunit = getXpath('(//*[@id="schema-offer"]/div[2]/p[1]/text())[1]', 'nodeValue');
      if (perunit != null) {
        perunit = perunit.split("/")[1]
        addElementToDocument('perunit', perunit);
      }
    });


    await context.extract(productDetails);

  },

};