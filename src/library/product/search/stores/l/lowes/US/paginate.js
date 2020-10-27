
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    nextLinkSelector: 'li:last-child a.arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a > span > article > span',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
