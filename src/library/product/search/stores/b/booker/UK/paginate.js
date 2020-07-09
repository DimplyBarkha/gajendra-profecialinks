
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    nextLinkSelector: '#pagingCtrls > span > a:not(.pagerSelected)',
    loadedSelector: 'span#BPLIC table',
    noResultsXPath: '//div[contains(@class,"boxValidationError")]/ul/li',
    domain: 'booker.co.uk',
  },
};
