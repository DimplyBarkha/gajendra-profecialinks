// @ts-ignore
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'macys',
    transform: transform,
    domain: 'macys.com',
    zipcode: '',
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      var name = getXpath('//script[@id="productMktData"]/text()', 'nodeValue');
      if (name != null) {
        var img = name.split('\"image":')[1]
        if (img != null) {
          var img = img.split(",")[0]
          var img = img.slice(2, -1)
          addElementToDocument('image', img);
        }
      }
      if (name != null) {
        var ID = name.split('"productID":')[1]
        if (ID != null) {
          var ID = ID.split(",")[0]
          var ID = ID.slice(2, -1)
          addElementToDocument('ID', ID);
        }
      }      
      var name = getXpath('//script[@id="productMktData"]//following-sibling::script[1]/text()', 'nodeValue');
      if (name != null) {
        var upc = name.split('upcNumber')[1]
        if (upc != null) {
          var upc = upc.split(",")[0]
          var upc = upc.slice(5, -3)
          addElementToDocument('upc', upc);
        }
      }
      if (name != null) {
        var des = name.split('completeName')[1]
        if (des != null) {
          var des = des.split(",")[0]
          var des = des.slice(5, -3)
          addElementToDocument('completeName', des);
        }
      }   
    });

    return await context.extract(productDetails, { transform });
  },
};