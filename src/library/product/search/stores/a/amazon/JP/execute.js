
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    domain: 'amazon.jp',
    url: 'https://www.amazon.co.jp/s?k={searchTerms}&ref=nb_sb_noss_1',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
