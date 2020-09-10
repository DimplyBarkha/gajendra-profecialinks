
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.searchcontainer',
    noResultsXPath: '//div[@class="page-header page-header--no-margin-bottom"]',
    //loadedSelector: '',
    //noResultsXPath: '',
    openSearchDefinition: null,
    domain: 'magasin.dk',
    zipcode: '',
  },
};
