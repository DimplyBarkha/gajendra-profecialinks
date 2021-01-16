module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    domain: 'alloffice.se',
    //loadedSelector: 'button[data-test-id="add-to-cart-button"]',
    loadedXpath: '//h1[contains(.,"Sökresultat för")] | //button[contains(@data-test-id,"add-to-cart-button")]',
    noResultsXPath: '//div[contains(@id,"content-container")][contains(.,"Din sökning gav inga träffar. Vänligen försök igen med en annan sökterm eller använd kategorierna i menyn.")]',
    // noResultsXPath: '//font[contains(text(),"no hits")] | //font[contains(text(),"try another")] | //*[contains(text(),"Kan inte köpas i webbutiken")]',
    zipcode: '',
  },
};
