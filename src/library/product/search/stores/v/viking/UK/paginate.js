
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'viking',
    nextLinkSelector: 'a#paginationPageNext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#siteContent',
    noResultsXPath: '//div[@id="searchEmpty"]',
    openSearchDefinition: null,
    domain: 'viking-direct.co.uk',
    zipcode: '',
  },
};
