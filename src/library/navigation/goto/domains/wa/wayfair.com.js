
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'wayfair.com',
    timeout: 8000000,
    country: 'US',
    store: 'wayfair',
    zipcode: '',
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
  //   await context.goto(url, {
  //     block_ads: false,
  //     load_all_resources: true,
  //     images_enabled: true,
  //     timeout: 1000000,
  //     waitUntil: 'load',
  //   });
  // },
};
