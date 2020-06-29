
module.exports = {
  parameterValues: {
    domain: 'elcorteingles.es/deportes',
    country: 'ES',
    store: 'elcorteingles_deportes',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, {
      first_request_timeout: 1000000,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 1000000,
      waitUntil: 'load',
      checkBlocked: true,
    });
  },

};
