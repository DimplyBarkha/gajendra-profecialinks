
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    domain: 'tiendanimal.es',
    url: 'https://www.tiendanimal.es/advanced_search_result.php?keywords={searchTerms}',
    loadedSelector: 'div.productList',
    noResultsXPath: '//h2[@class="fs-20 color-secundary border-bottom pb2 mb2"]',
    zipcode: '',
  },
};
