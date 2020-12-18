
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'durstexpress',
    nextLinkSelector: null,
    // "#amasty-shopby-product-list > div:nth-child(3) > div.pages > ul > li.item.pages-item-next > a",
    // nextLinkXpath: '(//ul[@class="items pages-items"]//li[@class="item pages-item-next"]//a)[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    // 'div[class="products wrapper grid items-grid items-grid-partitioned category-products-grid hover-effect equal-height "] ol',
    // ".column.main",
    // offset: 30,
    noResultsXPath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.durstexpress.de/berlin1/catalogsearch/result/index/?p={page}&q={searchTerms}',
    //   },
    domain: 'durstexpress.de',
    zipcode: '',
  },
};
