
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    loadedSelector: 'img.product-gallery__picture,a.gallery-link img',
    noResultsXPath: "//div[contains(@class, 'error-container')]//p | //h1[@class='editorial__block-title']",
    zipcode: '',
  },
};
