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
  //availibility//
  var avail = getXpath("(//div[@class='pdp error-message']/text())[1]", 'nodeValue');
  if (avail != null){
    avail = "Out of Stock"
    addElementToDocument("avail", avail)
  }
  else {
    avail = "In Stock"
    addElementToDocument("avail", avail)
  }

  //brand//

  var brand4 = getXpath('(//a[@class="btn-add-to-list"]/following::script[@type="application/json"])[1]/text()', 'nodeValue');
  if (brand4!=null){
    var data = JSON.parse(brand4);
    try {
      var brand = data[0].ecommerce.add.products[0].brand;
      addElementToDocument("brand", brand)
    } catch (error) {
      
    }
  }

  //image//
  var image = getXpath("(//div[@class='pdp-mobile-image-container']/img)[1]/@src", 'nodeValue');
  if (image != null){
    image = image.replace('https','http')
    addElementToDocument("image", image)
  }


});

await context.extract(productDetails);
},
};
