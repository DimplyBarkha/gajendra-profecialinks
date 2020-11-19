
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.bestbuy.ca/en-ca/search?search={searchTerms}&pn={page}',
    //   },
    domain: 'bestbuy.ca/en-ca',
    zipcode: '',
  },
};
