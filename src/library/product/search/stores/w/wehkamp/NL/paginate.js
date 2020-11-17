
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    nextLinkSelector: '#app > div.blaze-row > section > nav > ul > li:nth-child(15) > a',
    nextLinkXpath: null,
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
