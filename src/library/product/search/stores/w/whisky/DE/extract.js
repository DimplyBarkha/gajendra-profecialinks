const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    transform: transform,
    domain: 'whisky.de',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) 
{
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="panel-body"]>div[class="row"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
      const element = nodeSet.snapshotItem(index);
      if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
      };
    var price = getAllXpath('//div[@class="panel-body"]//span[@class="article-price-default article-club-hidden"]//text()', 'nodeValue');
    var productid = getAllXpath('//div[contains(@class,"article-stock")]/@class', 'nodeValue');


    if (price.length >= 1) {
      for (var i = 0; i < price.length; i++) {
        price[i] = price[i].replace(",", ".");
        addHiddenDiv("PRICEVALUE", price[i], i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
