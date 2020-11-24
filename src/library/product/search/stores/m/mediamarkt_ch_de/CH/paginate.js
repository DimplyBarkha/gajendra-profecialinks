
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    nextLinkSelector: 'li.pagination-next',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[@id="search_no_result-top"] | //div[@id="product-details"] | //div[contains(@class, "cms_html_container")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
};
