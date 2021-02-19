
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor_fr',
    domain: 'manor_fr.ch',
    url: 'https://www.manor.ch/search/text#/q/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//*[@id="epoq_resultrows"]/div/div[1]/div',
    zipcode: '',
  },
};
