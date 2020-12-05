
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    // template: null,
    country: 'RU',
    store: 'eapteka',
    nextLinkSelector: 'a.custom-pagination__arrow.custom-pagination__arrow--next',
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.sec-categories__list.sec-search__list.ajax-container',
    //noResultsXPath: '//div[@class="container"]//h1[contains(.,"По запросу")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'eapteka.ru',
    zipcode: '',
  },
};
