
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    nextLinkSelector: 'a.pagerDeselected:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td.siteContent',
    noResultsXPath: 'div.boxValidationError',
    domain: 'booker.co.uk',
  },
};
