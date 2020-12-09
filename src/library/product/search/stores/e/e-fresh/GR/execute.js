
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'e-fresh',
    domain: 'e-fresh.gr',
    url: 'https://www.e-fresh.gr/el/search?q={searchTerms}',
    loadedSelector: 'div.row.products',
    noResultsXPath: '//div[@class="row products"]/div[contains(@class, "message-box")]',
    zipcode: "''",
  },
};
