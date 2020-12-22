
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    domain: 'mercadolibre.com.mx',
    url: 'https://listado.mercadolibre.com.mx/{searchTerms}/#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
