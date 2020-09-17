
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'donaghybros',
    domain: 'donaghybros.ie',
    url: 'https://donaghybros.ie/search/?q={searchTerms}',
    loadedSelector: 'ul#kuLandingProductsListUl',
    noResultsXPath: '//div[@id="kuNoRecordFound"][contains(@style,"display: block;")]',
  },
};
