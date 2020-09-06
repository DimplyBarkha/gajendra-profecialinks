module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    nextLinkSelector: 'a.ui-pagination-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#hs-below-list-items',
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    openSearchDefinition: null,
    domain: 'tmall.ru',
    zipcode: "''",
  },
};
