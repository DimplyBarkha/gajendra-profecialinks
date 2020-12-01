module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'quill',
    domain: 'quill.com',
    loadedSelector: 'div[id*="skuZoomImage"]> img',
    noResultsXPath: '//div[contains(@class,"hdrMessage") and contains(.," sorry")]',
    zipcode: '',
  },
};
