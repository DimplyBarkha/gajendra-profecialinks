module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    nextLinkSelector: 'div[class="b-listing_toolBarPagination"] > nav > a[class*="pagination_next"] , a[class*="is-nextPage"]>i',
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
