
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jpg.fr',
    timeout: 100000,
    country: 'FR',
    store: 'jpg',
    zipcode: '',
  },
  implementation: async ({ url, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 1000000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);

    const URL = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true, "cookie_jar":[{"name":"invCheckPostalCode","value":"${parameters.zipcode}"}]}[/!opt!]`;

    await context.goto(URL, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });

  },
};