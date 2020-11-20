
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'elcorteingles.es',
    store: 'elcorteingles',
    country: 'ES',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":80000,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 500000,
      waitUntil: 'load',
      first_request_timeout: 60000,
      // checkBlocked: true
    });

    const lastResponseData = await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });

    if (lastResponseData.status === 500) {
      throw Error('Bad response code: ' + lastResponseData.status);
    }

    if (lastResponseData.status === 403) {
      return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
    }
  },
};
