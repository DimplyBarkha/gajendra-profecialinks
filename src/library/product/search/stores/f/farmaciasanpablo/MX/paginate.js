
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'MX',
    store: 'farmaciasanpablo',
    nextLinkSelector: 'div.row.section-footer ul.pagination.pull-right',
    // nextLinkXpath: '(//a[@class="next"])[0]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="product-facet"]',
    loadedXpath: null,
    noResultsXPath: '//div[@class="yCmsContentSlot searchEmptyPageMiddle"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.farmaciasanpablo.com.mx/search/?text={searchTerms}&page={page}',
    // },
    domain: 'farmaciasanpablo.com.mx',
    zipcode: "''",
  },
};
