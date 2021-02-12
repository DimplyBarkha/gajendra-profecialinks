
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'amazonFresh_75204',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-component-type*="s-search-result"][data-asin]',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"No results for")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.amazon.com/s?k={searchTerms}&i=amazonfresh&ref=nb_sb_noss_2&page={page}',
    },
    domain: 'amazon.com',
    zipcode: '75204',
  },
};

/*
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh_75204',
    domain: 'amazon.com',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    openSearchDefinition: {
      template: 'https://www.amazon.com/s?k={searchTerms}&i=grocery&bbn=10329849011&page={page}',
    },
    loadedSelector: 'div[data-component-type*="s-search-result"][data-asin]',
    noResultsXPath: '//span[contains(text(),"No results for")]',
  },
};
*/
