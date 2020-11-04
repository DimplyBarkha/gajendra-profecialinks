
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    domain: 'amicafarmacia.com',
    loadedSelector: '#maincontent',
    noResultsXPath: '//*[@id="maincontent"]/div[1]/h1/span/font/font',
    zipcode: "''",
  },
};
