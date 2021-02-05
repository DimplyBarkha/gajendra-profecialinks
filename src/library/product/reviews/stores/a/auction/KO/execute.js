
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'KO',
    store: 'auction',
    domain: 'auction.co.kr',
    loadedSelector: 'div#divVipReview ul.list__review li.list-item',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
