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

    const gotoFn = async (url) => {
      console.log('goto url: ', url);
      await context.setJavaScriptEnabled(true);
      await context.setCssEnabled(true);
      await context.setLoadAllResources(true);
      await context.setLoadImages(true);
      await context.setBlockAds(false);

      const responseStatus = await context.goto(url, {
        antiCaptchaOptions: {
          provider: 'anti-captcha',
          type: 'GEETEST',
        },
        firstRequestTimeout: 60000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: false,
        force200: true,
        js_enabled: true,
        embed_iframes: true,
      });

      console.log('Status :', responseStatus.status);
      console.log('URL :', responseStatus.url);
    }

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
    }

    const isCaptchaSolved = async ({ cssCaptchaHandler }) => {
      await new Promise(resolve => setTimeout(resolve, 5000)); // wait until captch solver starts
      const maxTimeOut = 100000;
      let time = 0;
      let statusText = await captchStatus(cssCaptchaHandler);
      while (statusText === 'solving') {
        await new Promise(resolve => setTimeout(resolve, 500));
        time += 500;
        if (time >= maxTimeOut) {
          return false;
        };
        statusText = await captchStatus(cssCaptchaHandler);
      }

      if(statusText === 'fail') throw new Error('Captcha solver has failed');
      return true;
    }

    const clickGeetestRadarBtn = async (cssGeetestRadarBtn) => {
      try {
        await context.waitForElement(cssGeetestRadarBtn, { timeout: 10000 });
        await context.evaluateInFrame('iframe', (cssGeetestRadarBtn) => {
          document.querySelector(cssGeetestRadarBtn) && document.querySelector(cssGeetestRadarBtn).click();
        }, cssGeetestRadarBtn);
      } catch (error) {
        console.log('Geetest Radar Bgdgafaf not loaded: ', cssGeetestRadarBtn);
        console.log(error);
      }
    }

    const solveCaptchIfNecessary = async ({ captchaFrame, cssGeetestRadarBtn, cssCaptchaHandler, cssCaptchaText }) => {

      // wait extra 10 seconds for js redirects
      await new Promise(resolve => setTimeout(resolve, 15000));

      const captchaExists = await checkExistance(captchaFrame);
      if (captchaExists) {
        console.log('isCaptchaFramePresent:', true);
        try {
          await new Promise(resolve => setTimeout(resolve, 3000)); // check removing if works

          // check if blocked
          await context.evaluate(async (cssCaptchaText) => {
            let captchaText = document.querySelector(cssCaptchaText);
            if (captchaText) {
              captchaText = captchaText.innerText;

              if (captchaText == 'You have been blocked.') {
                // @ts-ignore
                throw new BlockedError('Blocked on Captcha Page')
              }
            }
          }, cssCaptchaText);

          console.log('Lokking For Captcha Handler...');
          await context.evaluateInFrame('iframe', (cssCaptchaHandler) => {
            const captchaHandler = document.querySelector(cssCaptchaHandler);
            if (!captchaHandler) {
              throw new Error('Captcha Handler Not Loaded...')
            }
            console.log('Handler found, clicking it');
            captchaHandler.click();
          }, cssCaptchaHandler);

          await new Promise(resolve => setTimeout(resolve, 15000));
          await context.waitForNavigation({ timeout: 10000 });
          console.log('Captcha Resolved Succefully...');
          // await clickGeetestRadarBtn(cssGeetestRadarBtn)
        } catch (e) {
          console.log('Something went wrong while solving captcha');
          console.log(e);
        }
      }
    }

    const checkPageLoaded = async () => {
      try {
        await context.waitForSelector('div[class~="f-productVisuals-mainIconZoom"]', { timeout: 60000 });
      } catch (e) {
        console.log('No details page');
      }
      try {
        await context.waitForSelector('div[class~="Article-itemInfo"] p[class~="Article-desc"]', { timeout: 60000 });
      } catch (e) {
        console.log('No details page');
      }
    }

    const submitForm = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await context.evaluateInFrame('iframe', async () => {
        const formInputs = document.querySelectorAll(`.geetest_form input`)

        // possibly click all?, since we are not sure which one to click
        formInputs.forEach(async (ele) => {
          ele.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        })
      });
    }

    const run = async () => {
      const captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title])";
      const cssGeetestRadarBtn = '.geetest_radar_btn';
      const cssCaptchaHandler = '.captcha-handler';
      const cssCaptchaText = '.captcha__human__title';

      const cssCaptcha = { captchaFrame, cssGeetestRadarBtn, cssCaptchaHandler, cssCaptchaText };

      await gotoFn(url);
      await solveCaptchIfNecessary(cssCaptcha);
      if (await isCaptchaSolved(cssCaptcha)) await submitForm();
      await checkPageLoaded();
    }
    await run();
  },
};