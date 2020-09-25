
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'teknosa.com',
    timeout: 60000,
    country: 'TR',
    store: 'teknosa',
    zipcode: '',
  },
  implementation: async ({ url }, { timeout }, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    timeout = timeout || 10000;
    await context.goto(url, { timeout, waitUntil: 'networkidle0', checkBlocked: true });
    await context.evaluate(() => {
      document.body.setAttribute('current-page', window.location.href);
    });
  },
};
