module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.shopping-list.search_results',
    noResultsXPath: '//div[@class="search-results__empty-message"]',
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 1,
      template: 'https://martinplace.romeosonline.com.au/search?page={page}&q={searchTerms}&utf8=%E2%9C%93',
    },
    domain: 'martinplace.romeosonline.com.au',
    zipcode: '',
  },
};
