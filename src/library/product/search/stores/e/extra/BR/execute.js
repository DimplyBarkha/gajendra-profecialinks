
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'extra',
    domain: 'extra.com.br',
    url: "https://www.extra.com.br/{searchTerms}/b",
    loadedSelector: "div.Loader__Wrapper-sc-1hj1bdl-0",
    noResultsXPath: "//div[@class='NoResultsMessage__Wrapper-yrk7mp-1 fFQmwL']",
    zipcode: '',
  },
};
