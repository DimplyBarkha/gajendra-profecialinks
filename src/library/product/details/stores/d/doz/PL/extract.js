const { transform } = require('../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mainUrl = await context.evaluate(() => {
    return window.location.href;
  });
  let pageNotFound = '';
  const mainUrlWithDomain = mainUrl.includes('https://www.doz.pl') ? mainUrl : 'https://www.doz.pl' + mainUrl;

  pageNotFound = await context.evaluate(() => {
    const pageNotFoundSelector = document.evaluate('//title[contains(text(),"Page not found")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    return pageNotFoundSelector || '';
  });
  console.log(pageNotFound);
  if (pageNotFound) {
    await context.goto(mainUrlWithDomain, { timeout: 5000, waitUntil: 'load', checkBlocked: true });
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'doz',
    transform: transform,
    domain: 'doz.pl',
    zipcode: '',
  },
  implementation,
};
