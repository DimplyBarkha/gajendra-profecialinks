
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.com',
    timeout: null,
    country: 'US',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"cookie_jar":[{"name":"BedBathUS1ntsh1","value":"US:USD"}]}[/!opt!]`;
    await context.goto(url);
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
