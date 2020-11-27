
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'rossmann.de',
    timeout: 30000,
    country: 'DE',
    store: 'rossmann',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const URL = `${url}#[!opt!]{"block_ads":true,"first_request_timeout":30,"load_timeout":30,"load_all_resources":true}[/!opt!]`;
    await context.goto(URL, { timeout: 50000, waitUntil: 'load' });
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
  },
};
