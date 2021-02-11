
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false);
    // await context.setUseRelayProxy(false);
    const newUrl = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;

    const responseStatus = await context.goto(newUrl, {
      firstRequestTimeout: 60000,
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      antiCaptchaOptions: {
        provider: '2-captcha',
        type: 'RECAPTCHA',
      },
    });
    console.log('Status :', responseStatus.status);
    console.log('URL :', responseStatus.url);
    
    const captchaFrame = 'iframe[_src*="captcha"]:not([title]), iframe[src*="captcha"]:not([title]), div.g-recaptcha';
    try {
      await context.waitForSelector(captchaFrame);
    } catch (error) {
      console.log('captcha not present : ', error);
    }

    console.log('captchaFrame : ', captchaFrame);
    const checkExistance = async (selector) => {
      return await context.evaluate(async (captchaSelector) => {
        return Boolean(document.querySelector(captchaSelector));
      }, selector);
    };
    try {
      const isCaptchaFramePresent = await checkExistance(captchaFrame);
      if (isCaptchaFramePresent) {
        console.log('isCaptcha', true);
        await context.evaluateInFrame(captchaFrame, () => grecaptcha.execute());
          // const captchaRes = await context.solveCaptcha({
          //   type: 'RECAPTCHA',
          //   inputElement: '.g-recaptcha',
          //   autoSubmit: true,
          // });
          // console.log('captcha response----->', captchaRes);
          // console.log('solved captcha, waiting for page change');
          await context.waitForNavigation({ timeout });
       
      }else{
        if(responseStatus.status === 403){
          return context.reportBlocked(responseStatus.status, 'Blocked: Could not solve CAPTCHA, Called ReplortBlocked');
        }
      }
    } catch (error) {
      console.log('captcha code failed');
    }
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await context.waitForSelector('button#footer_tc_privacy_button', { timeout: 10000 });
      await context.evaluate(() => {
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
        }
      })
    } catch (error) {
      console.log('error: ', error);
    }
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
