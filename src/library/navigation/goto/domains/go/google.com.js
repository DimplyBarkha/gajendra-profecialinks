
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'google.com',
    timeout: null,
    zipcode: '',
    country: 'US',
    store: 'google',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    
    await context.goto(url, { 
      timeout: 15000,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
     })
      // .catch((err) => {
      //   let captchaTypeText = err.data.captchaType;
      //   console.log(`Recaptcha hit? ${captchaTypeText}`);
      //   console.log(`${err.message}`)
      // });

      let test = await context.evaluate(()=>{
        return "Test";
      })

      // doesn't reach this code:
      console.log(test);

  },
};
