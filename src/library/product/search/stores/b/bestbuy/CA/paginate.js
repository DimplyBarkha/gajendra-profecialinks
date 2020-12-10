const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    nextLinkSelector: 'div[class="loadMoreRow_1TEZj loadMoreButtonContainer_35w02"]>button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="productList_31W-E"]',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   offset:30,
    //   template: 'https://www.bestbuy.ca/en-ca/search?search={searchTerms}',
    //  },
    domain: 'bestbuy.ca/en-ca',
    zipcode: '',
  },
};
