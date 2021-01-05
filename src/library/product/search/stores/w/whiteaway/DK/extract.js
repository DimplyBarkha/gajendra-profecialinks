const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    transform: transform,
    domain: 'whiteaway.com',
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
  const applyScroll = async function (context) {
  await context.evaluate(async function () {
    try{
      document.querySelector('#coiPage-1 > div.coi-banner__page-footer > div.coi-button-group > button.coi-banner__accept').click()
      await new Promise(r => setTimeout(r, 6000));
      // }
      }
      catch(error)
      {

      }
    let scrollTop = 0;
    while (scrollTop !== 50000) {
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      await stall(1000);
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  })
}
  await applyScroll(context);
  
  await context.evaluate(async function () {
  function addHiddenDiv(id, content, index) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    const originalDiv = document.querySelectorAll('div[class="star-rating__front"]')[index];
    originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  }
  const aggregateRating = document.querySelectorAll("div[class='star-rating__front']")
  for (let k = 0; k < aggregateRating.length; k++) {
  // @ts-ignore
  let singleRating = aggregateRating[k].style.width;
  singleRating = singleRating.slice(0, singleRating.length - 1)
  singleRating = (5 * singleRating) / 100;
  singleRating = singleRating.toFixed(1);
  addHiddenDiv('aggregateRating', singleRating, k);
  }
});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}