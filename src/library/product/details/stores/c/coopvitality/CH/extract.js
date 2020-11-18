
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    transform: null,
    domain: 'coopvitality.ch',
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
      // @ts-ignore
      const brand = window.dlObjects[0].ecommerce.detail.products[0].brand;
      addElementToDocument('brand', brand);

      // @ts-ignore
      const category = window.dlObjects[0].ecommerce.detail.products[0].category;
      var z = category.split("/");
      var len = z.length;
      for (let i=0 ; i<len; i++){
        addElementToDocument('category', z[i]);
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

      var name = getXpath('//span[@data-ui-id="page-title-wrapper"]/text()', 'nodeValue');
      if (name != null){
        var abc = name.split(" ");
        var zz = abc.slice(Math.max(abc.length - 2, 1))
        zz = zz.join(" ")
        addElementToDocument('zz', zz);
      }
      

      

    });
    await context.extract(productDetails);
  },
};
