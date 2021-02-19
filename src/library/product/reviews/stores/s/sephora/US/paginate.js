
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'sephora',
    // nextLinkSelector: 'ul[data-comp^="Pagination"] li button[aria-label="Next"]',
    nextLinkXpath: '//ul[contains(@data-comp,"Pagination")]//li//button[@aria-label="Next"]',
    mutationSelector: 'div#ratings-reviews-container p',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div[data-comp^="ReviewsStats"] div  div[data-comp="StyledComponent BaseComponent "] >  span[data-comp="StyledComponent BaseComponent "]',
    openSearchDefinition: null,
    domain: 'sephora.com',
    zipcode: '',
  },
};
