
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'sweetcare.pt',
    timeout: 9999999,
    country: 'PT',
    store: 'sweetcare',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
    ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;


    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    
    const responseStatus = await context.goto(url, {
    firstRequestTimeout: 60000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
    });

    await context.evaluate(async function () {
      //@ts-ignore
      ajaxCall("/ajax/geralh.ashx?a=locationPreferences", pageLoad1)
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      //@ts-ignore
      document.querySelector("#country").value = "PT";
      //@ts-ignore
      document.querySelector("#currencySelect").value = "EUR";
      //@ts-ignore
      document.querySelector("#updatePreferencesButton").click();
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    },
};
