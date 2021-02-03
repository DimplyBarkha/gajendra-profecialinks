module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    // loadedSelector: 'div[id="main-section"] div[class="tile"] img',
    loadedSelector: 'section[id="main"]',
    // noResultsXPath: '//h1[contains(text(),"Page Is Missing")]',
    noResultsXPath: '//h1[contains(text(),"Page Is Missing")] | //div[contains(@data-selector,"noresult-page")]'
  },
};
