
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    loadedSelector: 'div[class="product-detail-main-container"]',
    noResultsXPath: '//div[@class="notfound-content"]',
    zipcode: '',
  },
};
