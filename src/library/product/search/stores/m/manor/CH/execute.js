
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    domain: 'manor.ch',
    url: 'https://www.manor.ch/search/text#/q/{searchTerms}?offset=0',
    loadedSelector: 'div[id="epoq_resultrows"]>div',
    noResultsXPath: '//div[@class="m-textcomponent"]/p',
    zipcode: '',
  },
};
