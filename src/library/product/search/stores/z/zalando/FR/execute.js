
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'zalando',
    domain: 'zalando.fr',
    url: 'https://www.zalando.fr/femme/?q={searchTerms}',
    loadedSelector: 'div[class="_8P5KBX"] div[class="adFHlH _0xLoFW _7ckuOK mROyo1"]',
    noResultsXPath: '//div[@class="cat_container-1Py_q"]/div[@class="cat_noSearchResultsHeadline-1Q-I5"]',
    zipcode: '',
  },
};
