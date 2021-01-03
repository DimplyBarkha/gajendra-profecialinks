
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    noResultsXPath: '//div[@class="m-textcomponent"]//p[contains(text(),"Nous n’avons malheureusement trouvé aucun résultat")] | //h4//b[contains(text(),"Willkommen in der Welt von Manor!")]',
    nextLinkSelector: 'div.m-page-selection-pagination li.pagination-next.js-next:not(.disabled)',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'a.m-backtotop.js-back-to-top[style="display: block;"]',
    loadedSelector: 'div#epoq_resultrows div.epoq_resultrow',
    // openSearchDefinition: {
    //   offset: +24,
    //   template: 'https://www.manor.ch/search/text#/q/{searchTerms}?offset={offset}',
    // },
    domain: 'manor.ch',
    zipcode: '',
  },
};
