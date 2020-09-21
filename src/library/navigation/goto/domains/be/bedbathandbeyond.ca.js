
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.ca',
    timeout: null,
    country: 'CA',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    timeout = timeout || 10000;
    await context.setBypassCSP(true);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
