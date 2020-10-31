
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    domain: 'amicafarmacia.com',
    url: 'https://www.amicafarmacia.com/FACT-Finder/result?query={searchTerms}&pageSize=100000',
    loadedSelector: '#maincontent > div.columns > div.column.main',
    noResultsXPath: '//ff-template[contains(text(),"0 Risultati trovati")]',
    zipcode: "''",
  },
};
