const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    transform: transform,
    domain: 'whiteaway.com',
  },
  // implementation,
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
  while (scrollTop !== 100000) {
  await stall(500);
  scrollTop += 500;
  window.scroll(0, scrollTop);
  if (scrollTop === 100000) {
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

  // const aggregateRating = document.querySelectorAll("div[class='star-rating__front']")
  // for (let k = 0; k < aggregateRating.length; k++) {
  // // @ts-ignore
  // let singleRating = aggregateRating[k].style.width;
  // singleRating = singleRating.slice(0, singleRating.length - 1)
  // singleRating = (5 * singleRating) / 100;
  // singleRating = singleRating.toFixed(1);
  // addHiddenDiv('aggregateRating', singleRating, k);
  // }

  });
  return await context.extract(productDetails, { transform });
  //return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  }