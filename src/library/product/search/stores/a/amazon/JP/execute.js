module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    domain: 'amazon.co.jp',
    url: 'https://www.amazon.co.jp/s?k={searchTerms}&ref=nb_sb_noss_1',
    loadedSelector: 'div.sg-col-inner',
    noResultsXPath: '//span[contains(@class,"messaging-messages-no-results")]',
    zipcode: '',
  },
};
