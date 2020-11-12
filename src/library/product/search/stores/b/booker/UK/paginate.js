
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    nextLinkSelector: '#pagingCtrls > span > a:not(.pagerSelected)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'span#BPLIC table',
    noResultsXPath: 'div.boxValidationError',
    domain: 'booker.co.uk',
  },
};
