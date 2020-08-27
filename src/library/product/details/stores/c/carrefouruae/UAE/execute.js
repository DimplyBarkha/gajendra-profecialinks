
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UAE',
    store: 'carrefouruae',
    domain: 'carrefouruae.com',
    loadedSelector: 'div[id="js-productHeader"]',
    noResultsXPath: '//div[@class="maf-container"]/div[@class="error-page"]',
    zipcode: '',
  },
};
