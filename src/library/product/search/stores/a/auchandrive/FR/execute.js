
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchandrive',
    domain: 'auchandrive.fr',
    url: 'https://www.auchandrive.fr/update-catalog/{searchTerms}?fhLocation=//52/fr_FR/drive_id=54751/$s={searchTerms}&fhSort=-_match_rate,-margin_last_30_days_national&startIndex=0',
    loadedSelector: null,
    noResultsXPath: '//p[@class="products-empty__title"]',
  },
};
