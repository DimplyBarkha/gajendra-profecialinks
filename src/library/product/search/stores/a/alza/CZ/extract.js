const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    transform,
    domain: 'alza.cz',
    zipcode: '',
  }, implementation
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const redirectedToBlockedPage = await context.evaluate(async function() {
    if(document.querySelector('img[src*=ErrorStates]')) {
      return true;
    } else {
      return false;
    }
  });
  if(redirectedToBlockedPage) {
    throw new context.reportBlocked(302,'Redirected to Blocked page');
  }
  return await context.extract(productDetails, { transform });
}