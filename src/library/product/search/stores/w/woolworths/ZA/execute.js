
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'woolworths',
    domain: 'woolworths.co.za',
    url: 'https://www.woolworths.co.za/cat?Ntt={searchTerms}',
    loadedSelector: 'div.product--image img',
    noResultsXPath: '//div[contains(@class,"grid product-list__srp-info")]//span',
    zipcode: '',
  },
};
