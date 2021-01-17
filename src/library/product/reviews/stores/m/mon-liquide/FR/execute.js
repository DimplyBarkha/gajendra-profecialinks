
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'mon-liquide',
    domain: 'mon-liquide.fr',
    loadedSelector: 'div#columns',
    noResultsXPath: '//span[@class="eo_notemoyenne"][not(div)]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
