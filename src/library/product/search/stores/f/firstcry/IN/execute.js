
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'firstcry',
    domain: 'firstcry.com',
    url: 'https://www.firstcry.com/search?q={searchTerms}',
    loadedSelector: 'div.list_sec.fw.lft',
    noResultsXPath: null,
    zipcode: "''",
  },
};
