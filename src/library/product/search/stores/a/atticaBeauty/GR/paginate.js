
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GR',
    store: 'atticaBeauty',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productList',
    noResultsXPath: '//div[@class="status" and contains(., "Λυπούμαστε...")]',
    domain: 'atticadps.gr',
    zipcode: "''",
  },
};
