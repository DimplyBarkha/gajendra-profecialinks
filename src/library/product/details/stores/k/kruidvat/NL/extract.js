
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform: null,
    domain: 'kruidvat.nl',
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
    let scrollTop = 0;
    while (scrollTop !== 1000) {
      await stall(500);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 1000) {
        await stall(500);
        break;
      }
    }

    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    function dataBind(domElement, obj) {    
      var bind = domElement.getAttribute("bind").split(":");
    }
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
        // var elmnt = document.getElementById("myAnchor");
        // var attr = elmnt.getAttributeNode("target").value;
    var backgroundURL = getXpath('(//@data-stock)[1]').value;
    console.log(backgroundURL,'backgroundurl-----------')
    if (backgroundURL.includes('inStock')){
      var availabilty="In Stock"
    }
    else{
      var availabilty ="Out of Stock"
    }
    addElementToDocument('availabilty', availabilty);
    
  try{
    // @ts-ignore
    document.querySelector('#onetrust-accept-btn-handler').click()
    await new Promise(r => setTimeout(r, 6000));
    console.log('----------------------------------cookies')
    // }
    }
    catch(error)
    {

    }
  
  
});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}


