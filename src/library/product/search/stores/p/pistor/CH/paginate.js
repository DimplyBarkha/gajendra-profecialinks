
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'pistor',
    nextLinkSelector: 'div.pages a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'table.productlist.list',
    noResultsXPath: '//div[@id="search_content"]//div[@class="infobox"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pistorone.ch',
    zipcode: '',
  },
};
