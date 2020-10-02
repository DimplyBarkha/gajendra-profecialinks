module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    domain: 'pccomponentes.com',
    loadedSelector: 'div#contenedor-principal',
    noResultsXPath: "//h2[@class = 'text-xs-center titulo-subrayado']//text()",
    zipcode: '',
  },
};
