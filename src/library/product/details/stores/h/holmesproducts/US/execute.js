
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    domain: 'holmesproducts.com',
    loadedSelector: 'div#primary',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")]',
    zipcode: '',
  },
};
