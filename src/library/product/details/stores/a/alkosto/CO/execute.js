
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    domain: 'alkosto.com',
    loadedSelector: 'ul[class="products-grid first last odd"] , div[class="product-view"]',
    // noResultsXPath: '//p[@class="note-msg"]|//div[@class="bannerpro-container"]',
    noResultsXPath: '//*[contains(@class,"bannerpro-button-right")]',
    zipcode: '',
  },
};
