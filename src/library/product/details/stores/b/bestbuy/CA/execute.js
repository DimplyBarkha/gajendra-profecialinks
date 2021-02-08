
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    domain: 'bestbuy.ca/en-ca',
    loadedSelector: 'html>body',
    noResultsXPath: '//body[contains(@id,"page-not-found")] |  //div[contains(text(),"temporarily unavailable")]',
    zipcode: '',
  },
};
