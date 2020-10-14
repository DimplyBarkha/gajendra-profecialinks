const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function infiniteScroll () {
    let prevScroll = document.documentElement.scrollTop;
    while (true) {
      window.scrollBy(0, document.documentElement.clientHeight);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentScroll = document.documentElement.scrollTop;
      if (currentScroll === prevScroll) {
        break;
      }
      prevScroll = currentScroll;
    }
  }
  await context.evaluate(infiniteScroll);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'googleExpress',
    transform,
    domain: 'google.fr',
    zipcode: '',
  },
  implementation,
};
