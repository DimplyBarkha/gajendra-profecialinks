const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'JJFoodservice',
    transform: cleanUp,
    domain: 'jjfoodservice.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
    const getAllXpath = (xpath, prop) => {
    const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const result = [];
    for (let index = 0; index < nodeSet.snapshotLength; index++) {
    const element = nodeSet.snapshotItem(index);
    if (element) result.push(prop ? element[prop] : element.nodeValue);
    }
    return result;
    };
    
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('#jjfoods > div > div.sc-bdVaJa.bLdRfG > main > div.sc-jOVcOr.kDJWxr > div > div.sc-imAxmJ.hFVJzy > div.sc-esoVGF.bLMvps > h1')[0];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      // var getXpath = (xpath, prop) => {
      //   var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      //   let result;
      //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      //   else result = elem ? elem.singleNodeValue : '';
      //   return result && result.trim ? result.trim() : result;
      //   };  
      //   var aval = getXpath('(//a[@data-rw="product--add-button"])[1]', 'nodeValue');
      //   if(aval != null){
      //   aval = "In Stock";
      //   addHiddenDiv('aval', aval);
      //   }    
    var cat = getAllXpath('(//div[@class="sc-dTsoBL kFLVeC"]/span/a[position()>1])/text()[1]', 'nodeValue');
    for (let i=0;i<cat.length;i++){
      addHiddenDiv("cat", cat[i]);
      }


    });
    return await context.extract(productDetails);
    },
};
