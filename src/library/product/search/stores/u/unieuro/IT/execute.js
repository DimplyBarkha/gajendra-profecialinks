module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    domain: 'unieuro.it',
    url: 'https://www.unieuro.it/online/?q=Dyson%20cordfree',
    loadedSelector: 'body',
    noResultsXPath: "//div[@id='no-results-message']/p",
    zipcode: '',
  },
};
