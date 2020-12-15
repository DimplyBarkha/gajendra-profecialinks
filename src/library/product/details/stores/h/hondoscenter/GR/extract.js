module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    transform: null,
    domain: 'mall.sk',
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
      var avl = getXpath('//div[@class="availability-container visible"]/p/text()', 'nodeValue');
      if (avl != null) {
        avl = "In Stock"
        addElementToDocument('avl', avl);
      } else {
        avl = "Out of Stock"
        addElementToDocument('avl', avl);
      }
      var bull = getAllXpath('//div[@class="mb-content js-extended-description"]/div/text()', 'nodeValue');
         if(bull != null){
           var bullet = bull.join(" || ")
           addElementToDocument('bullet', bullet);
         }
         // @ts-ignore
         var sku = window.inlineAdminGlobalVariables.ItemCode
         if(sku != null){
          addElementToDocument('sku', sku);
         }
         var dup = getAllXpath('//div[@class="versions-container"]//ul[@class="dim-list dim-0-list color"]/li/@data-value', 'nodeValue');
             if(dup != null){
                var variants = dup.join(" | ");
                addElementToDocument('variants', variants);
             }
    });
    await context.extract(productDetails);
  },
};


