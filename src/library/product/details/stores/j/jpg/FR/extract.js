const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: transform,
    domain: 'jpg.fr',
    zipcode: '',
  },
implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
  await context.evaluate(async function () {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    // Method to Retrieve Xpath content of a Single Node
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    // Method to Retrieve Xpath content of a Multiple Nodes
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };
    const sliceURL = (data2, data3, data4) => {
      var old = ""
      if (data2 != null) old = old+"height" + data2; 
      if (data3 != null) old = old+"*depth" + data3; 
      if (data4 != null) old = old+"*Width" + data4;       
      addElementToDocument('shipping', old);

    };
    // var URL1 = getAllXpath("//div[@class='techs']//span[(text()='Peso dell'imballo')]/following-sibling::span", 'nodeValue');
    var URL2 = getXpath("//span[contains(text(),'Hauteur')]/following-sibling::text()", 'nodeValue');
    var URL3 = getXpath("(//span[contains(text(),'Profondeur')]/following-sibling::text())[1]", 'nodeValue');
    var URL4 = getXpath("//span[contains(text(),'Largeur')]/following-sibling::text()", 'nodeValue');
    console.log(URL2)
    sliceURL(URL2, URL3, URL4);
  });
  await context.extract(productDetails);
},
};