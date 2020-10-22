module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    timeout: 50000,
    zipcode: "95825",
    store: 'total_wine_95825',
    country: 'US',
  },
  // implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
  //   const timeout = parameters.timeout ? parameters.timeout : 50000;

  // await context.setBlockAds(false);
  // await context.setLoadAllResources(true);
  // await context.setLoadImages(true);
  // await context.setJavaScriptEnabled(true);
  // await context.setAntiFingerprint(false);
  // await context.setUseRelayProxy(false);
  // await context.goto(url, {
  // firstRequestTimeout: 40000,
  //   timeout: timeout,
  //     waitUntil: 'load',
  //       checkBlocked: false,
  //         antiCaptchaOptions: {
  //   type: 'RECAPTCHA',
  //   },
  // });
  // await context.setCssEnabled(true);
  // await context.setJavaScriptEnabled(true);
  // await context.setLoadImages(true);
  // await context.setLoadAllResources(true);
  // await context.goto(url, {
  //   firstRequestTimeout: 40000,
  //   timeout: timeout,
  //   waitUntil: 'load',
  //   checkBlocked: false,
  //   antiCaptchaOptions: {
  //     type: 'RECAPTCHA',
  //   },
  // });
  // const captchaFrame = 'iframe[_src*="https://www.google.com/recaptcha"]';
  // const checkExistance = async (selector) => {
  //   return await context.evaluate((captchaSelector) => {
  //     return Boolean(document.querySelector(captchaSelector));
  //   }, selector);
  // };
  // const isCaptchaFramePresent = await checkExistance(captchaFrame);
  // if (isCaptchaFramePresent) {
  //   try {
  //     console.log('isCaptcha', true);
  //     await context.waitForNavigation({ timeout });
  //     // @ts-ignore
  //     // eslint-disable-next-line no-undef
  //     await context.evaluateInFrame('iframe', () => grecaptcha.execute());
  //     console.log('solved captcha, waiting for page change');
  //     await context.waitForNavigation({ timeout });
  //   } catch (e) { console.log('could not solve captcha'); }
  // }
  //   if (zipcode) {
  //     await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
  //   }
  // },
};

