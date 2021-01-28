
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'yankeecandle',
    transform: null,
    domain: 'yankeecandle.com',
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
        var backgroundURL = getXpath('//div[@class="tealium"]/script//text()', 'nodeValue');
        var availability = getXpath('//p[@class="inStock"]//text()','nodeValue');
        if (backgroundURL.length > 0)
      { 
      var a=(backgroundURL).split('"product_id":["')[1].split('"],"product_name"')[0];
      }
      else{
        a= ''
      }
      if (availability.length > 0)
      { 
      var b="In stock"
      }
      else{
        b= 'Out of stock'
      }
      addElementToDocument('product_id', a);
      addElementToDocument('availabilty', b);
      console.log('product_id----------------',a)
      // const wyz = document.querySelectorAll('script')[53].outerHTML;
      // console.log(wyz,'---------------------wyz')
      // if (wyz.length > 0){
      //   var product_id = wyz.split('ct_id":["')[1].split('"],')[0];
      //   console.log(product_id,'---------------productid')
      // }
  });
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}