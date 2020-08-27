
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'laredoute.fr',
    timeout: null,
    country: 'FR',
    store: 'laredoute',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 90000, waitUntil: 'load', checkBlocked: false, first_request_timeout: 80000 });
    const navigationFuture = await context.waitForNavigation();
    try {
      const hasCaptcha = await context.evaluate(function (xp) {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
      }, '//*[@id="recaptcha-anchor"]');
      console.log('hasCaptcha: ', hasCaptcha);
      if (hasCaptcha) {
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '#recaptcha-anchor',
        });
      }
      await Promise.all([navigationFuture, hasCaptcha]);
    } catch (error) {
      console.log('error: ', error);
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
};
