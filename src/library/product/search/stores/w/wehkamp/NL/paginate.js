
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    nextLinkSelector: null,
    nextLinkXpath: "//nav[@data-qa-id='pagination']//ul//li/a[contains(text(),'volgende')]",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#app > div.blaze-row > section',
    loadedXpath: null,
    noResultsXPath: '//*[@id="app"]/div[@class="blaze-row"]/section//h1[contains(text(),"kunnen we niet vinden")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'wehkamp.nl',
    zipcode: "''",
  },
};
