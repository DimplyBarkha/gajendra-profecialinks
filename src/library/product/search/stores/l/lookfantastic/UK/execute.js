
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    domain: 'lookfantastic.com',
    url: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}',
    loadedSelector: "body",
    noResultsXPath: "//h1[contains(@id,'responsive-product-list-title') and (contains(text(),'Showing suggested') or  contains(text(),'search tips'))] ",
  },
};
