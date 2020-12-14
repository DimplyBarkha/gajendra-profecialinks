
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'amazon',
    // nextLinkSelector: 'li[class="a-last"]',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    // loadedXpath: '//*[@data-hook="review"]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div[data-hook="review"]',
    openSearchDefinition: {
      regexStr: '(?<=dp\/)(.+)(?=\/)',
      template: 'https://www.amazon.co.uk/product-reviews/{id}?sortBy=recent&pageNumber={page}',
    },
    domain: 'amazon.co.uk',
    zipcode: '',
  },
};
