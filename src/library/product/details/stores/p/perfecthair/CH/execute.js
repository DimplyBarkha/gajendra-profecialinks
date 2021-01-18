module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    domain: 'perfecthair.ch',
    loadedSelector: 'div[class *="product--image-container"] img',
    noResultsXPath: '//h1[@class="detail-error--headline"]',
    zipcode: '',
  }
};
