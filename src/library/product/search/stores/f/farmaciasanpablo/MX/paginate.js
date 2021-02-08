
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'MX',
    store: 'farmaciasanpablo',
    nextLinkSelector: 'div.row.section-footer ul.pagination.pull-right>li>a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="product-facet"]',
    loadedXpath: null,
    noResultsXPath: '//div[@class="yCmsContentSlot searchEmptyPageMiddle"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    domain: 'farmaciasanpablo.com.mx',
    zipcode: "''",
  },
};
