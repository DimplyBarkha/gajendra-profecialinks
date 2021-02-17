
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'mediamarkt',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//span[contains(@class, "StyledReviewsPaginationWrapper")]/button[not (contains(.,"V"))]',
    mutationSelector: null,
    spinnerSelector: 'div[class*="ReviewLoadingIndicator__StyledReviewLoadingWrapper"]',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    dateSelector: 'section[id*="reviews"] div[class*="Cardstyled__StyledCardWrapper"] div[class*="FlexBox__StyledBox"]:nth-child(1) > div:nth-child(2) span',
    // eslint-disable-next-line no-useless-escape
    datePattern: '([0-9]+)\.([0-9]+)\.([0-9]+)',
    dateReplacePattern: '$3-$2-$1',
    openSearchDefinition: null,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
};
