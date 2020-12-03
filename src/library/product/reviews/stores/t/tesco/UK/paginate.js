
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'tesco',
    nextLinkSelector: null,
    loadedSelector: 'div#review-data',
    noResultsXPath: '//h2[contains(.,"No reviews")]',
    openSearchDefinition: {
      template: 'https://www.tesco.com/groceries/en-GB/products/{id}?active-tab=product-reviews&page={page}#review-data',
    },
    domain: 'tesco.com',
    zipcode: '',
  },
};
