
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async (
    { url },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);

    const responseStatus = await context.goto(url, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        type: 'RECAPTCHA',
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    let captchaFrame = "iframe[_src*='captcha']:not([title]), iframe[src*='captcha']:not([title]), div.g-recaptcha";
    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log('error: without undescore ', error);
    }

    console.log('captchaFrame', captchaFrame);
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    const isCaptchaFramePresent = await checkExistance(captchaFrame);
    // const isCaptchaFramePresent = true;
    if (isCaptchaFramePresent) {
      console.log('isCaptcha', true);
      await context.waitForNavigation({ timeout });
      // @ts-ignore
      // eslint-disable-next-line no-undef
      await context.evaluateInFrame('iframe', () => grecaptcha.execute());
      console.log('solved captcha, waiting for page change');
      await context.waitForNavigation({ timeout });
      try {
        await context.waitForXPath('//div[@id="product-detail-page"]', { timeout });
      } catch (error) {
        console.log('error: ', error); 
      }
      try {
        await context.waitForXPath('//div[@class="product-list"]', { timeout });
      } catch (error) {
        console.log('error: ', error);
      }
      
      try {
      await context.waitForXPath('//button[@id="footer_tc_privacy_button"]', { timeout });
      await context.evaluateInFrame('iframe', () => {
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
        }
      });
      } catch (error) {
        console.log('error: ', error);
      }
    }
    try {
      await context.waitForXPath('//button[@id="footer_tc_privacy_button"]', { timeout });
      await context.evaluateInFrame('iframe', () => {
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
        }
      });
      
    } catch (error) {
      console.log('error: ', error);
    }
    try {
      await context.waitForXPath('//div[@class="ab-popin_content"]', { timeout: 30000 });
      await context.evaluateInFrame('iframe', () => {
        let closePopUp = document.querySelector('div.ab-popin_content button.modal__close');
        if (closePopUp) {
          // @ts-ignore
          closePopUp.click();
        }
      });
      } catch (error) {
        console.log('error: ', error);
      }
      try {
        await context.waitForXPath('//div[@class="ab-popin_content"]', { timeout: 30000 });
        await context.evaluateInFrame('iframe', () => {
          let closePopUp = document.querySelector('div.ab-popin_content button.modal__close');
          if (closePopUp) {
            // @ts-ignore
            closePopUp.click();
          }
        });
        } catch (error) {
          console.log('error: ', error);
        }
    await context.evaluate(async function () {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // await context.waitForXPath('//button[@id="footer_tc_privacy_button"]', { timeout: 30000 });
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
        }
      } catch (error) {
        console.log('error: ', error);
  
      }
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
  })
  },
};
