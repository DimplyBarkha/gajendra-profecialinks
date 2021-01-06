
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'worten.es',
    timeout: null,
    country: 'ES',
    store: 'worten',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false); 
    // const URL = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    const URL = url;
    await context.goto(URL, { timeout: 50000, waitUntil: 'load' });
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });

    const captchaFrame = "h2[data-translate='why_captcha_headline']";

    try {
      await context.waitForSelector(captchaFrame);
      await context.waitForSelector('iframe[sandbox="allow-same-origin allow-scripts"]');
    } catch(e) {
      console.log("Didn't find Captcha.");
    }

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    let isCaptchaFramePresent = await checkExistance(captchaFrame);
    console.log("isCaptcha:"+ isCaptchaFramePresent);

    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: '.g-recaptcha',
      });
      console.log('solved captcha, waiting for page change');
      context.waitForNavigation();
      console.log('Captcha vanished');
    };

    const checkRedirection = async () => {
      try {
        await context.waitForSelector('h1.w-product__name', { timeout });
        console.log('Redirected to another page.');
        return true;
      } catch (e) {
        console.log('Redirection did not happen.');
        return false;
      }
    };

    if (isCaptchaFramePresent) {
      await solveCaptcha();
      await new Promise(r => setTimeout(r, 5000));
    }
    const maxRetries = 3;
    let numberOfCaptchas = 0;

    isCaptchaFramePresent = await checkExistance(captchaFrame);

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
