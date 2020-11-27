
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_fr',
    nextLinkSelector: 'li.pagination-next',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'ul[class=products-list]',
    noResultsXPath: '//div[contains(@id, "search_no_result")] | //h1[contains(text(), "404")] | //div[contains(@class, "outer-brand")] | //body[contains(@class, "page-product")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.ch',
    zipcode: "''",
  },
};
