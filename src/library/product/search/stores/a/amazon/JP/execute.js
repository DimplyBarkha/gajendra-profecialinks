module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    domain: 'amazon.co.jp',
    url: 'https://www.amazon.co.jp/s?k={searchTerms}&rh=n%3A160384011%2Cp_89%3A{searchTerms}',
    loadedSelector: 'div.sg-col-inner',
    noResultsXPath: '//span[contains(@class,"messaging-messages-no-results")]',
    zipcode: '',
  },
  implementation,
};
