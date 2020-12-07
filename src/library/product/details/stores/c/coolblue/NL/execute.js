
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    loadedSelector: 'div.layout-content',
    noResultsXPath: '//p[contains(.,"Je bent naar een pagina geleid die niet bestaat. We helpen je graag de weg weer terug te vinden.")]',
    zipcode: '',
  },
};
