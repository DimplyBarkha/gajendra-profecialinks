
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    // nextLinkSelector: 'a.anchor-text.pointer > i.icon-chevron-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[contains(text()," Try checking your spelling for errors, ")]',
    openSearchDefinition: {
      template: 'https://www.danmurphys.com.au/search?searchTerm={searchTerms}&page={page}'
    },
    domain: 'danmurphys.com.au',
    zipcode: "''",
  },
};
