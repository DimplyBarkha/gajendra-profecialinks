
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    domain: 'digitec.ch',
    url: 'https://www.digitec.ch/de/search?q={searchTerms}',
    loadedSelector: "div[class*='productList'] article[class*='panelProduct'] article, main[id*='pageContent'] div[class*='productList'] article",
    noResultsXPath: "//p[contains(@class,'ZZsx') and contains(.,'No results')] | //main[contains(@id,'pageContent')]//h2[contains(.,'Leider nichts gefunden für')] | //main[contains(@id,'pageContent')]//div[contains(.,'Keine Produkte zu deiner Filterauswahl')] | //*[contains(.,'Keine Ergebnisse gefunden für')]",
    zipcode: '',
  },
};
