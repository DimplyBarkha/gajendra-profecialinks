
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bedbathandbeyond',
    openSearchDefinition: {
      offset: 24,
      template: 'https://www.bedbathandbeyond.ca/api/apps/bedbath/query/s1?web3feo=abc&start={offset}&q={searchTerms}&rows=24&site=BedBathCanada&wt=json&uids=null,666aac62-5b1c-4787-b84c-a4538ccf68ff&qlist=dysin,horm,dyson&currencyCode=USD&country=US&noFacet=true&rT=xtCompat&badge_ids=0000&isBrowser=true#[!opt!]{"type":"json"}[/!opt!]'
    },
    domain: 'bedbathandbeyond.com',
    zipcode: '',
  },
};
