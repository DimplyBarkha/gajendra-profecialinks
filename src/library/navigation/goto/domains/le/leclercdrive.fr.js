
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'leclercdrive.fr',
    timeout: null,
    country: 'FR',
    store: 'leclercdrive',
    zipcode: '',
  },
   implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);

    await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: true,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });

    const captchaFrame = 'iframe[src*="https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAAAAMASzVEiP16tBsAvC9Jbw%3D%3D&hash=8FE0CF7F8AB30EC588599D8046ED0E&cid=KhQJkLib_EHZkFSp5A0qkuZmdb2cFLUJRqgFNbEUN5fabQQlWbMZPKiaPMWigYbVUI-WmSlMnk7O1OxmnG8ZYI94S.UocNxQB1WlNDrrev&t=fe&referer=https%3A%2F%2Ffd5-courses.leclercdrive.fr%2Fmagasin-069401-Vitry-sur-Seine.aspx&s=9705"]';

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const checkRedirection = async () => {
      try {
        await context.waitForSelector('#my-account-option, span[itemprop="productID"]', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('Redirection did not happen.');
        return false;
      }
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);

    while (isCaptchaFramePresent && numberOfCaptchas < maxRetries) {
      console.log('isCaptcha', true);
      ++numberOfCaptchas;
      await context.waitForNavigation({ timeout });
      try {
        console.log(`Trying to solve captcha - count [${numberOfCaptchas}]`);
        // @ts-ignore
        // eslint-disable-next-line no-undef
        await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        console.log('solved captcha, waiting for page change');
        await context.waitForNavigation({ timeout });
        const redirectionSuccess = await checkRedirection();

        if (redirectionSuccess) {
          await context.evaluate((url) => {
            window.location.href = url;
          }, url);
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
          break;
        } else {
          await context.evaluate((url) => {
            // eslint-disable-next-line no-unused-expressions
            window.location.reload;
          });
          await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });
        }

        isCaptchaFramePresent = await checkExistance(captchaFrame);
      } catch (e) {
        console.log('Captcha did not load');
      }
    }

    isCaptchaFramePresent = await checkExistance(captchaFrame);

    if (isCaptchaFramePresent) {
      throw new Error('Failed to solve captcha');
    }
  }, 
};

