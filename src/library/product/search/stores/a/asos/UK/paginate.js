
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    nextLinkXpath: '//a[@data-auto-id="loadMoreProducts"]',
    mutationSelector: null,
    spinnerXpath: '//*[@data-auto-id="loadSpinner"]',
    loadedXpath: '//div[@data-auto-id="productList"]/section//article[@data-auto-id="productTile"]//a//img/@src',
    noResultsXPath: '//h2[contains(@class,"grid-text__title")][contains(text(),"NOTHING MATCHES YOUR SEARCH")]',
    openSearchDefinition: null,
    domain: 'asos.com',
  },
};
