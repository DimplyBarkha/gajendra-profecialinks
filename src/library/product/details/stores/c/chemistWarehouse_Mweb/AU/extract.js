const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  let list = await context.evaluate(() => !document.querySelector('div.search__result__product__list'))
  if (!list) {
  async function firstItemLink () {
    return await context.evaluate(function () {
      let firstItem = document.querySelector('div.search__result__product__image-holder a')
      // @ts-ignore
      firstItem = firstItem ? firstItem.href : '';
      return firstItem;
    });
  }
  const url = await firstItemLink();
  console.log('url: ', url);

  if ((url !== null) && (url !== '')) {
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  }
  await context.waitForNavigation();
}
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
    return await context.extract(productDetails, { transform });
    }
