
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'traklin',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="contents_wrap_all"] div[class*="matrix"]',
    noResultsXPath: '//h1[contains(text(), "לא נמצאו תוצאות חיפוש")]',
    openSearchDefinition: null,
    domain: 'traklin.co.il',
    zipcode: '',
  },
};
