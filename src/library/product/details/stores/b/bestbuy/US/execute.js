module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    loadedSelector: 'div.pl-page-content',
    noResultsXPath: '//title[contains(text(),"Page Not Found")]',
    zipcode: '',
  },
};
