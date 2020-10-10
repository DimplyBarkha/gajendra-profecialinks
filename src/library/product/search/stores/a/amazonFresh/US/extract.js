const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.waitForXPath('//div/@data-asin');
  await context.evaluate(async (xp) => {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    return !(document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
  }, '//div/@data-asin');
  await context.evaluate(() => {
    const searchEl = document.querySelector('div#my-search-url');
    if (searchEl) {
      searchEl.textContent = window.location.href;
      console.log(`urlDiv is already present - ${searchEl.textContent}`);
    } else {
      const searchUrl = window.location.href;
      const urlDiv = document.createElement('div');
      urlDiv.id = 'my-search-url';
      urlDiv.style.display = 'none';
      urlDiv.textContent = searchUrl;
      document.body.appendChild(urlDiv);
      console.log(`urlDiv is added- ${urlDiv.textContent}`);
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation,
};
