
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    domain: 'harveynorman.ie',
    url: 'https://www.harveynorman.ie/index.php?subcats=Y&status=A&pshort=N&pfull=N&pname=Y&pkeywords=Y&search_performed=Y&q={searchTerms}&dispatch=products.search',
    loadedSelector: 'div.tygh-content',
    noResultsXPath: null,
    zipcode: '',
  },
};
