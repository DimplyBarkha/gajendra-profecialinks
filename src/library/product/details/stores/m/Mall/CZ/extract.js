const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'Mall',
    transform: transform,
    domain: 'mall.cz',
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
      var name = getXpath('//span[@class="rating-percent"]/text()', 'nodeValue');
      if (name != null) {
        var agr = name.slice(0, -2);
        agr = (agr * 5) / 100;
        addElementToDocument('agr', agr);
      }
      var agg = getXpath('(//div[@class="pdrt__subtitle-info"]/a/img)[1]/@alt', 'nodeValue');
      if (agg != null) {
        addElementToDocument('agg', agg);
      } else {
        agg = getXpath('//article[@itemscope="itemscope"]/h1[@itemprop="name"]/text()', 'nodeValue');
        agg = agg.split(" ")[0];
        addElementToDocument('agg', agg);
      }
      var avl = getXpath('//div[@class="delivery-box"]/div[@class="pdra__status pdra__status--available"]/text()', 'nodeValue');
      if (avl != null) {
        avl = "In Stock"
        addElementToDocument('avl', avl);
      } else {
        avl = "Out of Stock"
        addElementToDocument('avl', avl);
      }
      var mat = getXpath("//li[contains(text(), 'Materiál')]/text()", 'nodeValue');
      if (mat != null) {
        mat = mat.split(":")[1];
        addElementToDocument('mat', mat.trim());
      }
      var bull = getAllXpath('//div[@id="product-detail-description"]//ul/li/span/text()', 'nodeValue');
         if(bull != null){
           var bullet = bull.join(" || ")
           addElementToDocument('bullet', bullet);
         }
    });
    await context.extract(productDetails);
  },
};
