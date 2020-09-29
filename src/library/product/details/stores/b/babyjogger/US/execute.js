
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'babyjogger',
    domain: 'babyjogger.com',
    loadedSelector: 'div[data-component="ZoomView"]',
    noResultsXPath: "//div[contains(@class,'error-code')] | //div[@class='storepage'] | //*[@id='product-search-results'] | //*[@id='bbjmainhomepage'] | //h2[contains(@class,'error-page-title')]",
    zipcode: '',
  },
};
