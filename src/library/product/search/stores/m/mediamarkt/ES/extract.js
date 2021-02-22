const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function(){
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
      await infiniteScroll();
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
  implementation,
};
