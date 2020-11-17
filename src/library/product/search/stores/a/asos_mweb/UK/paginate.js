
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // Hack: Getting rid of default pagination
  return false;
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'asos_mweb',
    loadedXpath: '//div[@data-auto-id="productList"]/section//article[@data-auto-id="productTile"]//a//img/@src',
    noResultsXPath: '//h2[contains(@class,"grid-text__title")][contains(text(),"NOTHING MATCHES YOUR SEARCH")]',
    domain: 'asos.com',
  },
  implementation,
};
