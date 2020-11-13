
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    domain: 'pharmasimple.com',
    url: 'https://pharmasimple.com/module/ambjolisearch/jolisearch?search_query={searchTerms}',
    loadedSelector: 'ul[class="product_list grid row"]',
    noResultsXPath: '//p[@class="alert alert-warning"]',
    zipcode: '',
  },
};
