const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    transform,
    domain: 'eldorado.ru',
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
    while (scrollTop !== 10000) {
      await stall(500);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 10000) {
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
  
  function addHiddenDiv(id, content, index) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    const originalDiv = document.querySelectorAll('span[class="tevqf5-0 cbJQML"]')[index];
    originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  let firstChildNode;
  const aggregateRating = document.querySelectorAll("span[class='tevqf5-0 cbJQML']")
  for (let k = 0; k < aggregateRating.length; k++) {
    firstChildNode = aggregateRating[k].getElementsByClassName('tevqf5-2 fBryir').length
    addHiddenDiv('aggregateRating', firstChildNode, k);
  }
});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
