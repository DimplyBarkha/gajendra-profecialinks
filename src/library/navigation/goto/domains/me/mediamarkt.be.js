
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.be',
    // timeout: 55000,
    country: 'BE',
    store: 'mediamarkt',
    zipcode: '',
  },
  // For navigating from home page to search page because search page is redirecting to home page.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);
  },
};
