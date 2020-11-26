const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform,
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
    const originalDiv = document.querySelectorAll('div[class="star-rating__front"]')[index];
    originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
//   const aggregateRating = document.querySelectorAll("div[class='star-rating__front']")
//   for (let k = 0; k < aggregateRating.length; k++) {
//   // @ts-ignore
//   let singleRating = aggregateRating[k].style.width;
//   singleRating = singleRating.slice(0, singleRating.length - 1)
//   singleRating = (5 * singleRating) / 100;
//   singleRating = singleRating.toFixed(1);
//   addHiddenDiv('aggregateRating', singleRating, k);
//   }
});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
