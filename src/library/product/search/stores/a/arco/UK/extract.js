

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { transform } = parameters;
  await context.evaluate(async function (context) {
    const isSelector = document.querySelector('div#infoholder');
    if (isSelector) {
      const url = document.querySelector('div#contentholder > div#imageholder >img').getAttribute('src');
      document.querySelector('div#infoholder > h1').setAttribute('url', url);
    }
    // next page button click
  //   const seeAllSelector = document.querySelector('ul> li > a > span[class="icon-arrow-right"]');
  //   if (seeAllSelector) {
  //     seeAllSelector.click();
  //   }
  });
  return await context.extract(productDetails, { transform });
}
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    transform,
    domain: 'arco.uk',
    zipcode: '',
  },
  implementation,
};
