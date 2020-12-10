
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsathome.com',
    timeout: '100000',
    country: 'UK',
    store: 'petsathome',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]`;
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
    const isCaptchaExist = await context.evaluate(function () {
     var captchaElement = document.querySelector('div.g-recaptcha');
     if(captchaElement){
       return true
     }
    });
    if(isCaptchaExist){
      const delay = t => new Promise(resolve => setTimeout(resolve, t));
      await delay(10000);
      await context.solveCaptcha({
        type: 'RECAPTCHA',
        inputElement: 'div.g-recaptcha',
        autoSubmit: true,
      });
    }
  },
};
