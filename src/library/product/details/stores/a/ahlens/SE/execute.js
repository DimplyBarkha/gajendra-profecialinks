
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    domain: 'ahlens.se',
    loadedSelector: 'body',
    noResultsXPath: "//div[@id='ahl-product-list-app']/div/div[2]",
    zipcode: '',
  },
};
