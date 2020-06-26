
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'auchandrive',
    openSearchDefinition: {
      pageOffset: 20,
      template: 'https://www.auchandrive.fr/update-catalog/{searchTerms}?fhLocation=//52/fr_FR/drive_id=54751/$s={searchTerms}&fhSort=-_match_rate,-margin_last_30_days_national&startIndex={page}',
    },
    domain: 'auchandrive.fr',
    nextLinkSelector: 'a.ui-pagination--next',
  },
};
