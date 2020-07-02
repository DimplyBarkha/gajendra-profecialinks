
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    nextLinkSelector: '#pagingCtrls > span > a:not(.pagerSelected)',
    loadedSelector: 'span#BPLIC table',
    noResultsXPath: 'div.boxValidationError',
    domain: 'booker.co.uk',
  },
};
