
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GB',
    store: 'very',
    domain: 'very.co.uk',
    url: 'https://www.very.co.uk/e/q/{searchTerms}.end',
    loadedSelector: 'ul.productList',
    noResultsXPath: '//strong[contains(text(), "Oops, we didn")]',
    zipcode: '',
  },
};
