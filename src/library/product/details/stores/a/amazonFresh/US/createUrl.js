
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    country: 'US',
    store: 'amazonFresh',
    url: 'https://amazon.com/dp/product/{id}/?fpw=alm&s=amazonfresh&fpw=fresh#[!opt!]{  "headers": {"cache-control": "max-age=0"}}[/!opt!]',
    // url: 'https://amazon.com/dp/product/{id}/?fpw=alm&s=amazonfresh&fpw=fresh#[!opt!]{"load_all_resources":true, "block_ads":false}[/!opt!]',
  },
};
