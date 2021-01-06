
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '//span[contains(text(),"Keine Kundenrezensionen")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
