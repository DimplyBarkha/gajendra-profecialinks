module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'connection',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    //noResultsXPath: null,
    noResultsXPath: '//*[@id="listView"]/div/table/tbody[not(*)]',
    stopConditionSelectorOrXpath: 'div.search-pager.text-right > nav > ul > li.pager-next.disabled',
    openSearchDefinition:  {
      template: 'https://www.connection.com/product/searchpage?SearchType=1&term={searchTerms}&pageNumber={page}&pageSize=12&url=https%3A%2F%2Fwww.connection.com%2FIPA%2FShop%2FProduct%2FSearch&mode=List',
    },
    domain: 'connection.com',
  },
};
