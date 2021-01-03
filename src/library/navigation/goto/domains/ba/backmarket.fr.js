
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'backmarket.fr',
    timeout: 900000,
    country: 'FR',
    store: 'backmarket',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    const lastResponseData = await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
    });
    console.log('lastResponseData.status: ', lastResponseData.status);
    if (lastResponseData.status === 404 || lastResponseData.status === 410) {
      console.log('lastResponseData.status: ', lastResponseData.status);
    }
  },
};
