
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsathome.com',
    timeout: '100000',
    country: 'UK',
    store: 'petsathome',
    zipcode: '',
  },implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies
    ) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, {
    firstRequestTimeout: 100000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
    antiCaptchaOptions: {
    type: 'RECAPTCHA',
    provider: '2-captcha',
    }
    })
   
    const captchaFrame = 'iframe[role="presentation"]';
    const checkExistance = async (selector) => {
    return await context.evaluate(async (captchaSelector) => {
    return Boolean(document.querySelector(captchaSelector));
    }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);
    if (isCaptchaFramePresent) {
    try {
    console.log('isCaptcha', true);
    await context.waitForNavigation({ timeout });
    // @ts-ignore
    // eslint-disable-next-line no-undef
    await context.evaluateInFrame('iframe', async function () {
    const delay = t => new Promise(resolve => setTimeout(resolve, t));

    await delay(2000);
      // @ts-ignore
      grecaptcha.execute();
    });
    console.log('solved captcha, waiting for page change');
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    await delay(2000);
    // document.querySelector('input[type="submit"]').click();
    await context.waitForNavigation({ timeout });
    } catch (e) { console.log('could not solve captcha'); console.log(e); }
    }
  }
};
