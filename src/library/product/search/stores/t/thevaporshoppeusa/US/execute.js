
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    domain: 'thevaporshoppeusa.com',
    url: 'https://thevaporshoppeusa.com/search?type=all&q={searchTerms}',
    loadedSelector: 'div.product-listing',
    noResultsXPath: null,
    zipcode: "''",
  },
};
