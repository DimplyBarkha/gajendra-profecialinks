const { transform } = require('../../../../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await timeout(5000);
    var count = 0;
    document.querySelectorAll('div.w-rating').forEach(elm => {
      var ratings = [...elm.querySelectorAll('span')];
      ratings.forEach(item => {
        if (item.className.includes("active")) {
          count++
        }
        if (item.className.includes("half")) {
          count = count - 0.5;
        }
      })
      elm.setAttribute('aggregateRating', count);
      count = 0;
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'worten',
    transform,
    domain: 'worten.es',
    zipcode: '',
  },
};
