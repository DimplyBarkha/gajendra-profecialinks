module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'fnac.com',
    timeout: 60000,
    country: 'FR',
    store: 'fnac',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);

    const gotoFn = async (url) => {
      console.log('goto url: ', url);
      const responseStatus = await context.goto(url, {
        antiCaptchaOptions: {
          provider: 'geetest-captcha-solver',
          type: 'GEETEST',
          autoSubmit: true,
        },
        firstRequestTimeout: 60000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: false,
      });

      const statusCode = responseStatus.status;
      console.log('Status :', statusCode);
      console.log('URL :', responseStatus.url);

      return { responseStatus, statusCode };
    };

    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };

    const captchStatus = async (cssCaptchaHandler) => {
      const status = await context.evaluateInFrame('iframe', (cssCaptchaHandler) => {
        const handler = document.querySelector(cssCaptchaHandler);
        if (!handler) return;

        return handler.getAttribute('captchastatus');
      }, cssCaptchaHandler);

      console.log('status: ', status);
      return status;
    };

    const isCaptchaSolved = async ({ cssCaptchaHandler }) => {
      await new Promise(resolve => setTimeout(resolve, 5000)); // wait until captch solver starts
      const maxTimeOut = 100000;
      let time = 0;
      let captchaStatus = await captchStatus(cssCaptchaHandler);
      while (captchaStatus === 'solving') {
        await new Promise(resolve => setTimeout(resolve, 500));
        time += 500;
        if (time >= maxTimeOut) {
          return false;
        };

        captchaStatus = await captchStatus(cssCaptchaHandler);
      }

      if (await captchStatus(cssCaptchaHandler) === 'fail') {
        throw new Error('Captcha solver failed');
      }
      return true;
    };

    const solveCaptchIfNecessary = async ({ captchaFrame, cssCaptchaHandler }) => {
      const captchaExists = await checkExistance(captchaFrame);
      if (captchaExists) {
        console.log('isCaptchaFramePresent:', true);
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          await context.evaluateInFrame('iframe', (cssCaptchaHandler) => {
            const handler = document.querySelector(cssCaptchaHandler);
            if (handler) {
              console.log('Handler found, clicking it');
              handler.click();
            } else {
              console.log('Handler not found');
            }
          }, cssCaptchaHandler);
        } catch (e) {
          console.log('Something went wrong while solving captcha');
          console.log(e);
        }
      }

      if (!await isCaptchaSolved()) {
        throw new Error('Captch not solved');
      }
    };

    const checkPageLoaded = async () => {
      try {
        await context.waitForSelector('div[class~="f-productVisuals-mainIcon"] img', { timeout: 60000 });
      } catch (e) {
        console.log('No details page');
      }
    };

    const run = async () => {
      const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
      const cssCaptchaHandler = '.captcha-handler';

      const cssCaptcha = { captchaFrame, cssCaptchaHandler };
      const { statusCode } = await gotoFn(url);

      if (statusCode === 403) {
        // waiting to load captcha
        try {
          await context.waitForSelector(captchaFrame, { timeout: 10000 });
          await solveCaptchIfNecessary(cssCaptcha); // captcha is being solved, but not getting submitted
          await context.waitForNavigation({ timeout: 10000 });
        } catch (error) {
          console.log(error);
        }
      }
      await checkPageLoaded();
    };

    await run();
  },
};
