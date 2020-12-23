const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 10000));
  await context.evaluate(async function () {
    const detailsPage = document.querySelector('.result-wrapper a');
    if (detailsPage) {
      detailsPage.click();
    }
  });
  await new Promise(resolve => setTimeout(resolve, 20000));
  // await context.waitForSelector('button.more-button.more_infos_tab-button');
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    transform: transform,
    domain: 'linenchest.com',
    zipcode: '',
  },
  implementation,
};
