
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'ocado',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedXpath: null,
    loadedSelector: '#overview',
    noResultsXPath: '//div[contains(@class,"nf-resourceNotFound")]|//div[contains(@class,"bop-reviews__fastReviewDescription") and contains(text(),"No reviews")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'ocado.com',
    zipcode: '',
  },
};
