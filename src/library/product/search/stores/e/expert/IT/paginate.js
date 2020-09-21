
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    // nextLinkSelector: 'div#app ~ div ul li:last-child>a',
    nextLinkSelector: 'a#nextLinkSelector',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="skywalker_riga_nome"] h3',
    noResultsXPath: '//h1/*[contains(text(), "non ha dato risultati")]',
    // openSearchDefinition: {
    //   template: `https://www.expertonline.it/it-IT-it/Ricerca.aspx?ev0='+'{searchTerms}'+'&pagina='+'{page}'`
    // },
    domain: 'expertonline.it',
    zipcode: '',
  },
};
