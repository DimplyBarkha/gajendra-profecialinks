const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector:null,
    noResultsXPath: null,
    // openSearchDefinition: {
    //   offset:30,
    //   template: 'https://www.bestbuy.ca/en-ca/search?search={searchTerms}',
    //  },
    domain: 'bestbuy.ca/en-ca',
    zipcode: '',
  },
};
