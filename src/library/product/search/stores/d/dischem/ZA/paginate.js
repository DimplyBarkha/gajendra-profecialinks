
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ZA',
    store: 'dischem',
    nextLinkSelector: null,
    nextLinkXpath: "(//div[@class='visible-xs']//li[contains(@class,'pages-item-next')])[2]",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products-grid ol li:first-child img',
    loadedXpath: null,
    noResultsXPath: "//div[@class='search results']//div[@class='message info empty']",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.dischem.co.za/catalogsearch/result/index/?p={page}&q={searchTerms}',
    },
    domain: 'dischem.co.za',
    zipcode: '',
  },
};
