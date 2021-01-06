
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '//span[contains(text(),"instant aucun commentaire client")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
