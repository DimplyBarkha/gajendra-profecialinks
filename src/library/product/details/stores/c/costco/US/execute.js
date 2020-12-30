
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    loadedSelector: 'div#product-page',
    noResultsXPath: '//div[contains(@id,"not_found_body")]',
    zipcode: '',
  },
};
