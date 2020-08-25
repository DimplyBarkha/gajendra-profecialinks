const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function pagination () {
    if (await checkForPagination()) {
      while (await checkForPagination()) {
        await context.extract(productDetails, { transform }, { type: 'APPEND' });
        context.click("li[class='pagination-next ng-scope'] a");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return await context.extract(productDetails, { transform }, { type: 'APPEND' });
    } else {
      return await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
  }
  async function checkForPagination () {
    return await context.evaluate(() => {
      return document.querySelector("li[class='pagination-next ng-scope'] a") ? true : false;
    });
  }
  await pagination();
  // console.log("OtherSel", await checkForPagination());
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    transform,
    domain: 'procie.fr',
    zipcode: '',
  },
  implementation,
};
