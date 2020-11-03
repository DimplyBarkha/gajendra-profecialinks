
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'officedepot.com',
    timeout: 80000,
    country: 'US',
    store: 'officedepot',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const URL = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(URL, { timeout: 50000, waitUntil: 'load' });
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
  },
};
