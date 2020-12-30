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
      while (scrollTop !== 1000000) {
          await stall(5000);
          scrollTop += 50000;
          window.scroll(0, scrollTop);
          if (scrollTop === 1000000) {
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
  });
  return await context.extract(productDetails, { transform });
  //return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  const ratings = document.querySelectorAll('.prod-rating');

Array.from(ratings).forEach(rating => {
    const stars = rating.querySelectorAll('span.rat--small');
    let ratingVal = 0;
    
    [...stars].forEach(star => {
        if (star.getAttribute('class').includes('on')) ++ratingVal;
        if (star.getAttribute('class').includes('half')) ratingVal += 0.5;
    });

    rating.setAttribute('rating', ratingVal);
});
}
