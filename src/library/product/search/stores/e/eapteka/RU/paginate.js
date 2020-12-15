
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'eapteka',
    // nextLinkSelector: 'a.custom-pagination__arrow.custom-pagination__arrow--next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.cc-item div.cc-item--img img',
    noResultsXPath: '//div[@class="container"]//h1[contains(.,"По запросу")] | //div[@class="sec-error"] | /html[@lang and not(//section[@class="cc-item"])]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.eapteka.ru/search/?q={searchTerms}&&PAGEN_1={page}',
    },
    domain: 'eapteka.ru',
    zipcode: '',
  },
};
