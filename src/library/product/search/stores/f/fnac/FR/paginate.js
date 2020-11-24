
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.articleList.Article-list',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'fnac.fr',
    zipcode: "''",
  },
};
