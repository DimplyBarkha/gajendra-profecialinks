const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    transform: transform,
    domain: 'whisky.de',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
  function getAllXpath(xpath, prop) {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element)
            result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;

      }
  function addHiddenDiv(id, content, index) {
  const newDiv = document.createElement('div');
  newDiv.id = id;
  newDiv.textContent = content;
  newDiv.style.display = 'none';
  const originalDiv = document.querySelectorAll('div[class="rating-box"] div[class="rating-stars"]')[index];
  // originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  var arr1 = getAllXpath('//div[@class="article-metadata"]//span[@class="article-price-default article-club-hidden"]/text()', 'nodeValue');
  if(arr1!= null) {
  var abc = "";for(var j=0; j<arr1.length;j=j+2){
  if (arr1[j] != null && arr1[j+1] != null){
  abc = abc + arr1[j].trim() +" , "+arr1[j+1].trim();
   }
        
   }
   }
  addHiddenDiv('price', abc, j);
});
return await context.extract(productDetails, { transform });
}
};
