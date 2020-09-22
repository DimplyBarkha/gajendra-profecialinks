
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'rakuten',
    nextLinkSelector: 'a.button.-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.vw-searchProductList',
    noResultsXPath: '//h1[@class="search-title"]/span[@class="message"][2]',
    openSearchDefinition: null,
    domain: 'rakuten.de',
    zipcode: '',
  },
};
