const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try{
    await context.waitForXPath('//section[contains(@id, "contentSegment")]');
  }catch(error){
    console.log('error: ', error);
  }
  await context.evaluate(async function () {
  async function infiniteScroll () {
    let prevScroll = document.documentElement.scrollTop;
    while (true) {
      window.scrollBy(0, document.documentElement.clientHeight);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const currentScroll = document.documentElement.scrollTop;
      if (currentScroll === prevScroll) {
        break;
      }
      prevScroll = currentScroll;
    }
  }
  await infiniteScroll();
 })
  return await context.extract(productDetails, { transform });
}
