
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'myntra.com',
    timeout: 120000,
    country: 'IN',
    store: 'myntra',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    // USING OPT TAGS > anti_fingerprint), to avoid blocking
    // #[!opt!]{"anti_fingerprint":false}[/!opt!]
    let timeOut = null;
    if(parameterValues.timeout) {
      timeOut = parameterValues.timeout;
    }
    // const url = `${inputs.url}#[!opt!]{"anti_fingerprint":false}[/!opt!]`;
    const url = `${inputs.url}`;
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    let response = await context.goto(url,
      {
        timeout: 150000,
        waitUntil: 'networkidle0',
      }
    );

    console.log('status', response.status);
    // await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  },
};
