
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    domain: 'expert.ie',
    loadedSelector: 'main#maincontent div.columns',
    noResultsXPath: '//*[contains(text(), "The page you requested was not found")]',
    zipcode: '',
  },
};
