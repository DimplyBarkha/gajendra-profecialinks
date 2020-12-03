
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    domain: 'tesco.com',
    loadedSelector: 'div#review-data',
    noResultsXPath: '//h2[contains(.,"No reviews")]',
    reviewUrl: 'https://www.tesco.com/groceries/en-GB/products/{id}#review-data',
  },
};
