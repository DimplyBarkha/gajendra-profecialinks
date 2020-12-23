
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    // nextLinkSelector: 'li[class="a-last"]',
    // nextLinkXpath: '(//a[@data-test="next-btn"])[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.amazon.de/s?k={searchTerms}&page={page}',
    //   },
    domain: 'freshamazon.de',
    zipcode: '',
  },
};
