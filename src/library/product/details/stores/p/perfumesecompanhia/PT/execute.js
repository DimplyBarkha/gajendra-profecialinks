
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    domain: 'perfumesecompanhia.pt',
    loadedSelector: '#containerResultsFilter img, div[itemtype*="Product"]',
    noResultsXPath: '//div[@id="result-filter"]/text()[contains(.," 0 resultados")]|//div[@class="gca"]/@class | //div[contains(@class,"wrap404")]',
    zipcode: "''",
  },
};
