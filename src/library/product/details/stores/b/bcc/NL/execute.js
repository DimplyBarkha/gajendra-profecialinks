
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    domain: 'bcc.nl',
    noResultsXPath: '//p[contains(.,"Dit product is helaas niet meer beschikbaar. Bekijk hieronder onze alternatieven.")]',
  },
};
