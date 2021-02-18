
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    domain: 'meny.no',
    loadedSelector: '#maincontent > div > div > header',
    noResultsXPath: "//p[contains(., 'Noe gikk galt') and contains(., 'ikke funnet')] | //main[@id='maincontent']/div[count(*)=0]",
    zipcode: '',
  },
};
