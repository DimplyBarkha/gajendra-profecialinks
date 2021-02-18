
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
<<<<<<< HEAD

  // @ts-ignore
  var a=''
  // @ts-ignore
  const c = document.querySelector('script[type="application/ld+json"]').innerText;
  const jsondata = JSON.parse(c);
  const gtin = jsondata.gtin13;
  if(c.includes('OutOfStock')){
    a="Out of Stock"

  }
  else{
    a= "In Stock"
  }
  addElementToDocument('a', a);
  addElementToDocument('b', gtin);


});
return await context.extract(productDetails, { transform });
// return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
=======
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    var name = getXpath('(//script[@type="application/ld+json"])[1]/text()', 'nodeValue');
    if (name != null) {
      var img = name.split('gtin13')[1]
      if (img != null) {
        var img = img.split(",")[0]
        var img = img.slice(3, -1)
        addElementToDocument('gtin', img);
      }
    }
    var a = ''
    // @ts-ignore
    const c = document.querySelector('script[type="application/ld+json"]').innerText;
    console.log(c, 'ggggggggggggggg')
    // @ts-ignore
    if (c.includes('OutOfStock')) {
      a = "Out of Stock"
    }
    else {
      a = "In Stock"
    }
    addElementToDocument('a', a);
  });
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
>>>>>>> 762bd759c2a908623b0538db0f767dc85bdd239a
