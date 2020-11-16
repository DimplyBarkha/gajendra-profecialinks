
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[contains(text()," Try checking your spelling for errors, ")]',
    openSearchDefinition: null,
    domain: 'danmurphys.com.au',
    zipcode: "''",
  },
};