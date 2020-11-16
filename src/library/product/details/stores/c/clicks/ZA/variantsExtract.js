const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  const { transform } = parameters;
  const { id } = inputs;
  console.log("inputs.id :: ", id);
  console.log("parameters :: ", parameters);
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  if (id) {
    async function firstItemLink() {
      return await context.evaluate(function () {
        let firstItem = document.querySelector('div.productBlock a')
        firstItem = firstItem ? firstItem.href : '';
        return firstItem;
      });
    }
    const url = await firstItemLink();
    console.log('url is $$$$$$$$$$$$$$$$$$$$$', url);
    if (url !== null) {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
    await context.waitForNavigation();
  }

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
// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;

//   const { id } = inputs;
//   console.log("inputs.id :: ", id);
//   if (id) {
//     await new Promise((resolve, reject) => setTimeout(resolve, 2000));
//     await context.waitForXPath('//div[@class="productBlock"]/a');

//     await context.waitForSelector('div.productBlock a');
//     console.log('everything fine !!!');
//     await context.evaluate(() => {
//       const firstItem = document.querySelector('div.productBlock a');
//       firstItem.click();
//     });

//     await new Promise((resolve, reject) => setTimeout(resolve, 2000));
//     console.log("click complete now:: ", id);
    
//   }
//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'ZA',
    store: 'clicks',
    transform: null,
    domain: 'clicks.co.za',
    zipcode: "''",
  },
  implementation,
};
