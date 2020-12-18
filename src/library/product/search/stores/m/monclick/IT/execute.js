
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    domain: 'monclick.it',
    url: 'https://www.monclick.it/risultati_ricerca?fh_view_size=50&fh_sort_by=-orderby_piupopolari,-_match_rate&fh_location=//root/it_IT/$s={searchTerms}/prontaconsegna%3d%7bpronta20consegna%7d&testo=Dyson vacuum',
    // line:''
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
