
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.ca',
    timeout: null,
    country: 'CA',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
