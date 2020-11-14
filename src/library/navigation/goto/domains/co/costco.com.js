
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'costco.com',
    country: 'US',
    timeout: 40000,
    store: 'costco',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 40000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
  },
  // implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
  //   if (zipcode) {
  //     url = `${url}#[!opt!]{"first_request_timeout":60000, "force3000": true, "cookie_jar":[{"name":"invCheckPostalCode","value":${zipcode}}]}[/!opt!]`;
  //   } else {
  //     url = `${url}#[!opt!]{"first_request_timeout":60000, "force3000": true}[/!opt!]`;
  //   }
  //   await context.goto(url, {
  //     block_ads: false,
  //     load_all_resources: true,
  //     images_enabled: true,
  //     timeout: 80000,
  //     waitUntil: 'load',
  //   });
  //   await context.waitForNavigation();
  // },
};
