
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    timeout: null,
    zipcode: '98188',
    country: 'US',
    store: 'costco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const zip = '98188';
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true, "cookie_jar":[{"name":"invCheckPostalCode","value":${zip}}]}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
  },
};
