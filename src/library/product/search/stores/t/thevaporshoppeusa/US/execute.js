
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    domain: 'thevaporshoppeusa.com',
    url: 'https://thevaporshoppeusa.com/collections/{searchTerms}',
    loadedSelector: 'div.product-listing',
    noResultsXPath: '//img[@alt="Empty Search"]',
    zipcode: "''",
  },
};
