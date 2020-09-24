
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'bedbathandbeyond.com',
    timeout: null,
    country: 'US',
    store: 'bedBathBeyond',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"load_timeout":60,"load_all_resources":true,"cookie_jar":[{"name":"BedBathUS1ntsh1","value":"US:USD"}]}[/!opt!]`;
    timeout = timeout || 10000;
    await context.setBypassCSP(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
