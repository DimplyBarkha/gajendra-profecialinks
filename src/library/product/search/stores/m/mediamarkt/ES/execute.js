module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    domain: 'mediamarkt.es',
    url: 'https://www.mediamarkt.es/es/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmeses',
    // url: 'https://www.mediamarkt.es/es/search.html?query={searchTerms}',
    loadedSelector: 'div[class*="ProductFlexBox"]',
    noResultsXPath: "//div[contains(@class,'ZeroResultsView')]//p[contains(.,'Lamentablemente, no encontramos una coincidencia adecuada para tu búsqueda')]",
    zipcode: '',
  },
};
