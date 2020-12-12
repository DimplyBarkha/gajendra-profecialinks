
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elgiganten.se',
    timeout: 200000,
    store: 'elgiganten',
    country: 'SE',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);
  },
};
