
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'mon-liquide',
    domain: 'mon-liquide.fr',
    loadedSelector: 'div.tab-content div#idTabavisverifies div#ajax_comment_content',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
