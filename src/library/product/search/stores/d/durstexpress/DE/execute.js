module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "DE",
    store: "durstexpress",
    domain: "durstexpress.de",
    url: "https://www.durstexpress.de/berlin1/catalogsearch/result/index/?product_list_limit=all&q={searchTerms}",
    // "https://www.durstexpress.de/berlin1/catalogsearch/result/?q={searchTerms}",
    loadedSelector: null,
    // 'div[class="products wrapper grid items-grid items-grid-partitioned category-products-grid hover-effect equal-height "] ol',
    // ".column.main",
    noResultsXPath: null,
    zipcode: "",
  },
};
