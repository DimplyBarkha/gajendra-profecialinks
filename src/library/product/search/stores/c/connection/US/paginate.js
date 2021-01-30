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
    //noResultsXPath: '//*[@id="listView"]/div/table/tbody/tr[1][not(@class)]',
    // stopConditionSelectorOrXpath: 'button[class="nav-pagin-item--next"]',
    //stopConditionSelectorOrXpath: '//div[@class="search-pager text-right"]//ul[@class="pagination pagination-sm"]//li[position()=last() and @class="pager-next disabled"]',
    //stopConditionSelectorOrXpath: '#searchResultContainer > div.search-navigation-bottom.row.ExcludeFromEmail > div.search-pager.text-right > nav > ul > li.pager-next.disabled',
    openSearchDefinition:  {
      template: 'https://www.connection.com/product/searchpage?SearchType=1&term={searchTerms}&pageNumber={page}&pageSize=12&url=https%3A%2F%2Fwww.connection.com%2FIPA%2FShop%2FProduct%2FSearch&mode=List',
    },
    domain: 'connection.com',
  },
};
