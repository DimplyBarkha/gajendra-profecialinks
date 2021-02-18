
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'drizly',
    domain: 'drizly.com',
    url: 'https://drizly.com/search?q={searchTerms}',
    loadedSelector: 'div.product-container',
    noResultsXPath: '/html/body/div/main/section/div[@class="SearchDeadEnds__Row___3paQf SearchDeadEnds__HeaderContainer___3Fe7G"]',
    zipcode: "''",
  },
};
