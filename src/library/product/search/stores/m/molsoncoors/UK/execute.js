
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'molsoncoors',
    domain: 'mymolsoncoors.com',
    url: 'https://www.mymolsoncoors.com/ccrz__ProductList?&operation=quickSearch&searchText={searchTerms}',
    loadedSelector: 'span.cc_product_container',
    noResultsXPath: '//*[contains(text(), "No Results Found")]',
    zipcode: "''",
  },
};
