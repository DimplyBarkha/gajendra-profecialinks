
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    domain: 'lookfantastic.com',
    url: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}',
    loadedSelector: "li[class*='productListProducts_product']",
    noResultsXPath: "//h1[contains(@id,'responsive-product-list-title') and (contains(text(),'Showing suggested') or  contains(text(),'search tips'))] ",
  },
};
