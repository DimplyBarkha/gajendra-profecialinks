
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    domain: 'kroger.com',
    loadedSelector: 'div.ProductDetails',
    noResultsXPath: '//div[@id="notFound"] | //h2[contains(text(),"to have a bad link")]',
    reviewUrl: '',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
