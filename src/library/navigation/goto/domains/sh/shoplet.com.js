
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shoplet.com',
    timeout: 100000,
    country: 'US',
    store: 'shoplet',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const resp=await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false,firstRequestTimeout:60000,antiCaptchaOptions:{type: 'RECAPTCHA'} });
    console.log('response at goto:',resp);
    if(resp.status==200){
      let hasCaptchaExists= await context.evaluate(function(){
        return document.querySelector('div#captcha-container.captcha');
      });
      if(hasCaptchaExists){
        //await context.evaluateInFrame('iframe', () => grecaptcha.execute());
        try {
          await context.evaluateInFrame('iframe', () => grecaptcha.execute());
          await new Promise((resolve) => setTimeout(resolve, 8000));
        } catch(err) {
          console.log('got some error - ', err.message);
          console.log('retrying!!');
          try {
            await context.evaluateInFrame('iframe', () => grecaptcha.execute());
            await new Promise((resolve) => setTimeout(resolve, 8000));
          } catch(err) {
            console.log('re-tried that - still error - ', err.message);
            throw Error ('grecaptcha is not working!!');
          }
        }
      }
    }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
