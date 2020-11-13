
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    domain: 'planethair.it',
    url: 'https://www.planethair.it/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search',
    loadedSelector: 'div.grid-list',
    noResultsXPath: '//p[contains(@class, "no-items")]',
    zipcode: '',
  },
};
