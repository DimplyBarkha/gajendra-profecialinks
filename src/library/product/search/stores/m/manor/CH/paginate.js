
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    noResultsXPath: '//div[@class="m-textcomponent"]/p',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="epoq_resultrows"]>div',
    openSearchDefinition: {
      offset: 24,
      template: 'https://www.manor.ch/search/text#/q/{searchTerms}?offset={offset}',
    },
    domain: 'manor.ch',
    zipcode: '',
  },
};
