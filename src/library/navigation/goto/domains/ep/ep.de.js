module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'ep.de',
    timeout: 50000,
    country: 'DE',
    store: 'ep',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // const timeout = parameters.timeout ? parameters.timeout : 50000;

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
