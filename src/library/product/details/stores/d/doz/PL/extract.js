const { transform } = require('../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mainUrl = await context.evaluate(() => {
    return window.location.href;
  });
  let mainUrlWithDomain = '';
  mainUrlWithDomain = mainUrl.includes('https://www.doz.pl') ? mainUrl : 'https://www.doz.pl' + mainUrl;
  if (mainUrlWithDomain) {
    await context.goto(mainUrlWithDomain, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  }
  await context.evaluate(async function (sku) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    addHiddenDiv('sku', searchURL);
  });
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
