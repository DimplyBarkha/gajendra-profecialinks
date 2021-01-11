
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'hairshop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.hair-shop.com/catalogsearch/result/index/?p={page}&q={searchTerms}',
      },
    domain: 'hair-shop.com',
    zipcode: '',
  },
};