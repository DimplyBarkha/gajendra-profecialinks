
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'costco.com.mx',
    prefix: null,
    url: 'https://www.costco.com.mx/p/{id}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]',
    country: 'MX',
    store: 'costco',
    zipcode: '',
  },
};
