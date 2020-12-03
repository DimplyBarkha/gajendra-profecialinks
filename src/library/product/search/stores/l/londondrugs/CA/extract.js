const { transform } = require('../../../../../search/shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class='product-details']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const aggregateRating = document.querySelectorAll("span[class='bv-rating-stars-on bv-rating-stars']");
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      addHiddenDiv('aggregateRating', singleRating, k);
    }
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(8000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    transform: transform,
    domain: 'londondrugs.com',
    zipcode: '',
  },
  implementation,
};
