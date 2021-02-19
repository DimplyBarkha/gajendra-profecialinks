
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    transform: null,
    domain: 'notino.de',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
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

    // @ts-ignore
    var a = ''
    var gtin=''
    var price=''
    // @ts-ignore
    const c = document.querySelector('script[type="application/ld+json"]').innerText;
    const jsondata = JSON.parse(c);
    if (c.includes('gtin13')) {
       gtin = jsondata.gtin13;

    }
    if (c.includes('price')) {
      var price1 = jsondata.offers;
      for (var i = 0; i < price1.length; i++) {
        price=price1[i].price
      
      }
      
      

    }
    if (c.includes('OutOfStock')) {
      a = "Out of Stock"

    }
    else {
      a = "In Stock"
    }
    addElementToDocument('a', a);
    addElementToDocument('b', gtin);
    // @ts-ignore
    // const d = getXpath('//div[@id="pd-price"]/span[1]//text()', 'nodevalue');
    // const d1 = getXpath('//div[@id="pd-price"]/span[2]//text()', 'nodevalue');

    // // var v = d.replace(',', '.')
    // console.log(d1,'aaaaaaaaaaaaaaaaa',d)
    addElementToDocument('price', price);


  });
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
