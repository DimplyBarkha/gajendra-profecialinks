
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    loadedSelector: 'div[class="product-detail-main-container"],div[class="search-product-list-content display-mode-list active"]',
    // loadedSelector: 'iframe[id="frame_content"]',
    noResultsXPath: '//div[@class="notfound-content"] | //div[contains(@class,"search-empty")]',
    zipcode: '',
  },
};
