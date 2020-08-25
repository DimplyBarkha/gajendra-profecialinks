
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'harveynorman',
    domain: 'harveynorman.co.nz',
    url: 'https://www.harveynorman.co.nz/index.php?pshort=N&pfull=N&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search',
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: '//p[contains(text(),"Search was unable to find any results for")]',
    zipcode: '',
  },
};
