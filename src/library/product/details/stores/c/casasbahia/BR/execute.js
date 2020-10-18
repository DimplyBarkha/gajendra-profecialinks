
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    domain: 'casasbahia.com.br',
    loadedSelector: 'div[id*="Conteudo_PanelMaster"]',
    noResultsXPath: '//div[@class="not-found"]',
    zipcode: "''",
  },
};
