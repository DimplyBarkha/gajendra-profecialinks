
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    domain: 'manor.ch',
    url: 'https://www.manor.ch/search/text#/q/{searchTerms}?offset=0',
    loadedSelector: 'div[class="o-producttile__image js-product-image"]',
    noResultsXPath: '//div[@class="m-textcomponent"]//p[contains(text(),"Nous n’avons malheureusement trouvé aucun résultat")] | //h4//b[contains(text(),"Willkommen in der Welt von Manor!")]',
    zipcode: '',
  },
};
