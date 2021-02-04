module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    nextLinkSelector: 'div[class="b-listing_toolBarPagination"] > nav > a[class*="pagination_next"] , a[class*="is-nextPage"]',
    loadedSelector: 'div[class*="offerBox"]',
    noResultsXPath: '//div[@class="s-search_empty"]',
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
