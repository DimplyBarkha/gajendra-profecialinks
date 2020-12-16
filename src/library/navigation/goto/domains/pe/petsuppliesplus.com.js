
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsuppliesplus.com',
    timeout: '60000',
    country: 'US',
    store: 'petsuppliesplus',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const URL = `${url}#[!opt!]{"block_ads":true,"first_request_timeout":30,"load_timeout":30,"load_all_resources":true}[/!opt!]`;
    await context.goto(URL, { timeout: 50000, waitUntil: 'load' });
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
    await dependencies.setZipCode({ url, zipcode: '60440-2380' });
  },
};
