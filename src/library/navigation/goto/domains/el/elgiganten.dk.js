
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elgiganten.dk',
    timeout: 200000,
    country: 'DK',
    store: 'elgiganten',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);
    // await context.setBlockAds(false);
    // await context.goto(`${url}`, {
    //   anti_fingerprint: true,
    //   discard_CSP_header: false,
    //   timeout: 100000,
    //   waitUntil: 'load',
    // });

  },
};
