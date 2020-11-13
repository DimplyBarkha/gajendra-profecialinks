
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'makro',
    nextLinkSelector: 'a.mfcss_load-more-articles p.pull-left span',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.body, ex-article-search-page',
    noResultsXPath: '//div[@class="ex-search-header"]//span[text()="Brak wyników!"]',
    openSearchDefinition: null,
    domain: 'makro.pl',
    zipcode: '',
  },
};
