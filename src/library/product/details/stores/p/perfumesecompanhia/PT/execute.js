
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    domain: 'perfumesecompanhia.pt',
    loadedXpath: '//div[@id="result-filter"][contains(text(), "1 resultados")] | //div[contains(@itemtype,"Product")]',
    noResultsXPath: '//div[@id="result-filter"][not(contains(text(), "1 resultados"))] | //div[@id="result-filter"]/text()[contains(.," 0 resultados")]|//div[@class="gca"]/@class | //div[contains(@class,"wrap404")] | //div[@class="banner"]/div[@data_analytics] | //div[@id="containerResultsFilter"]//map[@name] | //div[@id="ACT-body"] | //div[@id="containerResultsFilter"]//link[@type="text/css"]',
    zipcode: "''",
  },
};
