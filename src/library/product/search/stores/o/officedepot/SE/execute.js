
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'officedepot',
    domain: 'officedepot.se',
    url: "https://www.officedepot.se/sok?query={searchTerms}",
    loadedSelector: "div[class='section search-result-products'] div[class='thumbnail padding-xs-5 clearfix'] div[class='thumbnail-inner'] img[class='group list-group-image']",
    noResultsXPath: "//h4[@id='search-header' and contains(.,'gav 0 träffar')]",
    zipcode: '',
  },
};
