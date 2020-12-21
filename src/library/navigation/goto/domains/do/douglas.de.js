
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
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    // Check if cookies pop-up appeared
    await context.waitForSelector('#uc-banner-centered');
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
