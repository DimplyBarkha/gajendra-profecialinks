
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    domain: 'carrefour.it',
    loadedSelector: 'div.product-images',
    noResultsXPath: '//h2[contains(text(),"la pagina richiesta non esiste")]|//h1[contains(text(),"forse hai sbagliato corsia")]|//div[@class="slide-content"]|//div[@class="editorial-header container"]',
    zipcode: '',
  },
};
