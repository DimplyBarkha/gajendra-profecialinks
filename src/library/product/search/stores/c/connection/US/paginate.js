module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'connection',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    // stopConditionSelectorOrXpath: 'button[class="nav-pagin-item--next"]',
    //stopConditionSelectorOrXpath: '//div[@data-sel="nav-pagin"]//button[position()=last() and @class="nav-pagin-item--active"]',
    openSearchDefinition:  {
      page: 1,
      template: 'https://www.connection.com/product/searchpage?SearchType=1&term={searchTerms}&pageNumber={page}&pageSize=12&url=https%3A%2F%2Fwww.connection.com%2FIPA%2FShop%2FProduct%2FSearch&mode=List',
    },
    domain: 'connection.com',
  },
};
