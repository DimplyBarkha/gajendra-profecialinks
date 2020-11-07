
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'apo-rot',
    domain: 'apo-rot.de',
    url: 'https://www.apo-rot.de/index_search.html?_filternolimits=x&_filterktext={searchTerms}',
    loadedSelector: 'div.products',
    noResultsXPath: '//div[@data-blockinfo="nosearch_loopwasempty"]//p',
    zipcode: "''",
  },
};
