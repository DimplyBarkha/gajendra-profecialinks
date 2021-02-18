
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mechta.kz',
    timeout: 70000,
    country: 'KZ',
    store: 'mechta',
    zipcode: "''",
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   url = `${url}#[!opt!]{"first_request_timeout":70000, "force200": true}[/!opt!]`;
  //   await context.goto(url, {
  //     block_ads: false,
  //     load_all_resources: true,
  //     images_enabled: true,
  //     timeout: 100000,
  //     waitUntil: 'load',
  //   });
  // },
};
