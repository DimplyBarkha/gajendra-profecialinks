// const { dependencies } = require("@library/navigation/auth/action");
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsmart.ca',
    timeout: null,
    country: 'CA',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};
