
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'superama',
    // nextLinkSelector: 'button.btnSuperama.btnSuperama-blanco',
    // nextLinkXpath: '//button[@class="btnSuperama btnSuperama-blanco"]',
    //nextLinkXpath: '//button[contains(@class,"btnSuperama")]',
    // mutationSelector: null,
    // spinnerSelector: 'div.loader11',
    loadedSelector: 'div.portfolio.full-portfolio.grids ul li',
    //loadedXpath: null,
    noResultsXPath: '//div[@id="conten_error"]/@style[contains(.,"block")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: 'div#resultadosBusquedaContainerGeneral',
    openSearchDefinition: null,
    domain: 'superama.com.mx',
    zipcode: '',
  },
};
