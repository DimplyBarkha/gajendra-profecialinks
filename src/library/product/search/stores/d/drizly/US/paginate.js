
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'drizly',
    nextLinkSelector: null,
    // 'section > div > div > div > div > div > div.Pagination__PageNumber__link--wrapper___2DFHE ',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-container',
    loadedXpath: null,
    noResultsXPath: '/html/body/div/main/section/div[@class="SearchDeadEnds__Row___3paQf SearchDeadEnds__HeaderContainer___3Fe7G"]',
    //  '//section/div/div/div/a[@class="Pagination__Pagination__chevron__right___2LaS5"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: 
    {
      template: 'https://drizly.com/search?button=&page={page}&q={searchTerms}&utf8=%E2%9C%93'
    },
    domain: 'drizly.com',
    zipcode: "''",
  },
};
