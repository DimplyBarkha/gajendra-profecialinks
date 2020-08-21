
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    domain: 'harveynorman.ie',
    url: 'https://www.harveynorman.ie/index.php?pshort=N&pfull=N&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search',
    loadedSelector: 'div.hproduct-col.product-col',
    noResultsXPath: '//p[starts-with(text(),"Search was unable to find any results for")]',
    zipcode: '',
  },
};
