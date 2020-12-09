
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    domain: 'perfumesecompanhia.pt',
    loadedSelector: '#containerResultsFilter img',
    noResultsXPath: '//div[@id="result-filter"]/text()[contains(.," 0 resultados")]|//div[@class="gca"]/@class',
    zipcode: "''",
  },
};
