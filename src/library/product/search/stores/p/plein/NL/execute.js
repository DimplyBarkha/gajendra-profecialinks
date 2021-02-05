module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    domain: 'plein.nl',
    url: 'https://www.plein.nl/zoeken?search={searchTerms}',
    loadedSelector: 'div.product-view-container',
    // noResultsXPath: '//div[contains(text(),"Probeer eens een merknaam of beschrijving van je product in te typen.")]',
    zipcode: "''",
  },  
};
