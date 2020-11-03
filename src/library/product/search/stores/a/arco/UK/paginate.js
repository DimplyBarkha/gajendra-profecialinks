
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    nextLinkSelector: '#topBar > div.pagination.clearfix > ul',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,searchTerms)]/span[contains(text(),"Sorry, your search for ")]',
    openSearchDefinition: null,
    domain: 'arco.uk',
    zipcode: '',
  },
};
