const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const searchEl = document.querySelector('span.kds-Text--l');
    let searchTerms;
    if (searchEl) {
      const searchText = searchEl.textContent;
      const idx = searchText.indexOf(':');
      searchTerms = searchText.slice(idx + 2);
    }

    const url = `https://www.kroger.com/search?query=${searchTerms}&searchType=natural`;

    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;

    document.body.appendChild(searchUrlDiv);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
    domain: 'kroger.com',
  },
  implementation,
};
