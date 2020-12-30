//const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  const { transform } = parameters;
  const { id } = inputs;
  console.log('inputs.id :: ', id);
  console.log('parameters :: ', parameters);
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  if (id) {
    // eslint-disable-next-line no-inner-declarations
    async function firstItemLink () {
      return await context.evaluate(function () {
        let firstItem = document.querySelector('a[itemprop="url"]');
        firstItem = firstItem ? firstItem.href : '';
        return firstItem;
      });
    }
  //   const url = await firstItemLink();
  //   console.log('url is $$$$$$$$$$$$$$$$$$$$$', url);
  //   if (url !== null) {
  //     await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  //   }
  //   await context.waitForNavigation();
  // }

  // await context.evaluate(function () {
  //   const firstItem = document.querySelector('div.productBlock a');
  //   if (firstItem) {
  //     firstItem.click();
  //     return ['firstItem clicked now'];
  //   }
  //   console.log("click complete now:: ", id);
  //   return ['not clicked... returning now'];
  // }, createUrl);

  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuyCA',
    transform: transform,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
  implementation,
};