
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.es',
    timeout: 60000,
    country: 'ES',
    store: 'fnac',
    zipcode: '',
  },
  implementation: async ({ url }, parameterValues, context, dependencies) => {

    const timeout = parameterValues.timeout ? parameterValues.timeout : 60000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });

    try {
      await context.waitForSelector('span.geetest_radar_tip_content', { timeout: 45000 });
    } catch (error) {
      console.log('No verification needed.');
    }

    const verifyAccess = await context.evaluate(function () {
      return Boolean(document.querySelector('span.geetest_radar_tip_content'));
    });

    if (verifyAccess) {
      await context.evaluate(function () {
        document.querySelector('span.geetest_radar_tip_content').click();
      });
    }

    await context.waitForSelector('span.Header__logo-img', { timeout: 45000 });
  },
};
