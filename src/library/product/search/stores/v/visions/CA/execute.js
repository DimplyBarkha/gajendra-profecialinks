
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    domain: 'visions.ca',
    url: 'https://www.visions.ca/catalogue/category/ProductResults.aspx?categoryId=0&searchText={searchTerms}',
    loadedSelector: "div[class*='prodlist-itembox']",
    noResultsXPath: "//td[@id='catenav-content-col2']//h3[contains(.,'No product found.')]",
    zipcode: '',
  },
};
