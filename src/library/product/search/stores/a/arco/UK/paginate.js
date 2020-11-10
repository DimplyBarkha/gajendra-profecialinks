
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class = "inner"] > img',
    noResultsXPath: '//div[contains(@class,searchTerms)]/span[contains(text(),"Sorry, your search for ")]',
    openSearchDefinition: {},
    domain: 'arco.uk',
    zipcode: '',
  },
};
