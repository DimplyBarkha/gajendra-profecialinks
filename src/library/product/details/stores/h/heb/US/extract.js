const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'heb',
    transform: cleanUp,
    domain: 'heb.com',
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
    var getXpath = (xpath, prop) => {
    var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    let result;
    if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    else result = elem ? elem.singleNodeValue : '';
    return result && result.trim ? result.trim() : result;
  };
  // const brand1 = getXpath("(//div[@class='block-right']//script[@type='application/json']/text())[1]", 'nodeValue');
  // if (brand1 != null){
  //   var ubc = JSON.parse(brand1)
  //   var brand = ubc[0].ecommerce.add.products[0].brand
  //   addElementToDocument('brand', brand);
  // }
});

await context.extract(productDetails);
},
};
