
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'douglas.de',
    country: 'DE',
    timeout: 50000,
    store: 'douglas',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const url = `${inputs.url}`;
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    //await context.setCookies();
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true, cookies: [] });
    // Check if cookies pop-up appeared
    try {
    await context.waitForSelector('#uc-banner-centered');
    } catch(error) {
      console.log(error)
    }
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('#uc-banner-centered'));
    });
    if (doesPopupExist) {
      await context.click('button#uc-btn-accept-banner');
    }
    try {
      await context.clickAndWaitForNavigation('button#uc-btn-accept-banner', {}, { timeout: 50000 });
    } catch (err) {
      console.log('Click & Navigation error' + err);
    }
  },
};
