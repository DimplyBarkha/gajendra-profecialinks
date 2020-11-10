
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CO',
    store: 'falabella',
    domain: 'falabella.com.co',
    loadedSelector: "section[class *='pdp-image-section'] img[id *='testId']",
    noResultsXPath: "//div[contains(@class,'no-result')]//h3[contains(text(),'El producto que estás buscando ya no está disponible')]",
    zipcode: '',
  },
};
