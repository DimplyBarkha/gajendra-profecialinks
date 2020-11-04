
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    country: 'US',
    store: 'costco',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    if (zipcode) {
      url = `${url}#[!opt!]{"first_request_timeout":60000, "force3000": true, "cookie_jar":[{"name":"invCheckPostalCode","value":${zipcode}}]}[/!opt!]`;
    } else {
      url = `${url}#[!opt!]{"first_request_timeout":60000, "force3000": true}[/!opt!]`;
    }
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 80000,
      waitUntil: 'load',
    });
    await context.waitForNavigation();
  },
};
