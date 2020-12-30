const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    nextLinkSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="productList_31W-E"]',
    noResultsXPath: '//body[@id="page-not-found"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
