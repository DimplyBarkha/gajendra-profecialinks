
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'Mall',
    nextLinkSelector: 'div[class="nav-pagin--block--show-next"]>button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: {
     // offset = 30,
      template: 'https://www.mall.cz/znacka/{searchTerms}?page={page}',
      },
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mall.cz',
    zipcode: '',
  },
};
