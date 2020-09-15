
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'farmers.co.nz',
    prefix: null,
    url: 'https://www.farmers.co.nz/{id}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]',
    country: 'NZ',
    store: 'farmers',
    zipcode: '',
  },
};
