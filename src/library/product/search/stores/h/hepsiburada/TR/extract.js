const { transform } = require('../shared');
async function implementation (
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
    document.querySelectorAll("span.ratings > span").forEach(item => {
      const element = item.getAttribute('style').match(/(\d+)/)[0];
      item.setAttribute('aggregaterating', element/20);
    });
    await timeout(5000);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    transform,
    domain: 'hepsiburada.com',
    zipcode: '',
  },
  implementation,
};
