
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'nicehair',
    domain: 'nicehair.dk',
    url: "https://nicehair.dk/search?text={searchTerms}",
    loadedSelector: "div[data-gmp-list-name='searched_product_list'] div[class *='product-list-data'] div[class='product-image'] a[class='product-image'] img",
    noResultsXPath: "//input[@class='search-no-products']",
    zipcode: '',
  },
};
