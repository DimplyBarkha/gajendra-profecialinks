const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'Mall',
    transform: transform,
    domain: 'mall.cz',
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
  await context.waitForFunction(function () {
    return Boolean(document.querySelector('h3[class="lst-product-item-title text-collapse"]') || document.evaluate('//h3[@class="lst-product-item-title text-collapse"]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  }, { timeout: 90000 });
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
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
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('h3[class="lst-product-item-title text-collapse"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let firstChildNode;
    let secondChildNode = 0;
    let thirdChildNode;
    const aggregateRating = document.querySelectorAll("div[class='lst-product-item-body']>div>span[class='rat--small']");
    for (let k = 0; k < aggregateRating.length; k++) {
      secondChildNode = 0;
      firstChildNode = aggregateRating[k].getElementsByClassName('rat-item rat-item--on').length;
      secondChildNode = aggregateRating[k].getElementsByClassName('rat-item rat-item--half').length;
      if (secondChildNode > 0) {
        secondChildNode = secondChildNode - 0.5
      }
      thirdChildNode = firstChildNode + secondChildNode;
      addHiddenDiv('aggregateRating', thirdChildNode, k);
    }
  });
  return await context.extract(productDetails, { transform });
}
