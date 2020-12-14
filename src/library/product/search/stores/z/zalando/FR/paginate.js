
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'zalando',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="cat_wrapper-15Tgg _8P5KBX"]//li[last()]/a/@href',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="_8P5KBX"] div[class="adFHlH _0xLoFW _7ckuOK mROyo1"] div[class="qMZa55 SQGpu8 iOzucJ JT3_zV DvypSJ"]',
    loadedXpath: '//div[@class="_8P5KBX"]//div[@class="adFHlH _0xLoFW _7ckuOK mROyo1"]/div[contains(@class, "qMZa55 SQGpu8 iOzucJ")]',
    noResultsXPath: '//div[@class="cat_container-1Py_q"]/div[@class="cat_noSearchResultsHeadline-1Q-I5"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zalando.fr',
    zipcode: '',
  },
};
