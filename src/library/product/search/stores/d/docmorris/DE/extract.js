const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    transform,
    domain: 'docmorris.de',
    zipcode: '',
  },
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { transform } = parameters;
  await context.evaluate(async function(context) {
    //next page button click
    const seeAllSelector = document.querySelector('span[class="gicon-bracketright-green"]');
    if(seeAllSelector) {
      seeAllSelector.click();
    }
  });
   return await context.extract(productDetails, { transform })
 }