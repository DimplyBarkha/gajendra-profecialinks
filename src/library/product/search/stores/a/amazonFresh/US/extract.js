const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForXPath('//div/@data-asin');

  await context.evaluate(() => {
    const searchEl = document.querySelector('div#my-search-url');
    if (searchEl) {
      searchEl.textContent = window.location.href;
    } else {
      const searchUrl = window.location.href;
      const urlDiv = document.createElement('div');
      urlDiv.id = 'my-search-url';
      urlDiv.style.display = 'none';
      urlDiv.textContent = searchUrl;
      document.body.appendChild(urlDiv);
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
