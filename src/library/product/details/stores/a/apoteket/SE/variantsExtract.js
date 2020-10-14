const { transform } = require('../shared')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    transform,
    domain: 'apoteket.se',
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
  const { variants } = dependencies;
  await context.waitForSelector('div.product-grid__items div.grid-item');
  async function firstItemLink () {
    return await context.evaluate(function () {
      let firstItem = document.querySelector('div.grid-product__content.grid-item__content a')
      // @ts-ignore
      firstItem = firstItem ? firstItem.href : '';
      let finalLink
      // @ts-ignore
      if(firstItem.includes('http') & firstItem !== ''){
        finalLink = firstItem
      // @ts-ignore
      }else if(firstItem !== ''){
        finalLink = 'https://www.apoteket.se'+firstItem;
      }
      return finalLink;
    });
  }
  const url = await firstItemLink();
  if (url !== null) {
    await context.goto(url, { timeout: 90000, waitUntil: 'load', checkBlocked: true });
  }
  // await context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  return await context.extract(variants, { transform });
  }
