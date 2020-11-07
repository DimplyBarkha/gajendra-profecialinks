
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coop',
    nextLinkSelector: 'nav li.pagination__nextPage:not(._is_inactive) > a.pagination__link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article.listItem',
    noResultsXPath: '//div[contains(@class,"altHead") and contains(text(),"0 producten voor")]',
    openSearchDefinition: null,
    domain: 'coop.nl',
    zipcode: "''",
  },
};
