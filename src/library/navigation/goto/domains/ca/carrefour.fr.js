
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    console.log("BEFORE GOTO");
    await context.goto(url);
    console.log("AFTER GOTO");
    try {
      console.log("IN TRY BLOCK");
      let Captcha = await context.waitForSelector('div.g-recaptcha');
      console.log('Captcha: ', Captcha);
      if(Captcha){
        console.log("CAPTCHA FOUND!!")
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: '.g-recaptcha'
        });
        await new Promise(r => setTimeout(r, 5000));
        await context.click({
          "constructor": "MouseEvent",
          "target": {
            "cssSelector": "span.recaptcha-checkbox"
          },
          "typeArg": "click",
          "eventInit": {
            "bubbles": true,
            "cancelable": true,
            "detail": 1,
            "screenX": 90,
            "screenY": 429,
            "clientX": 82,
            "clientY": 151,
            "ctrlKey": false,
            "shiftKey": false,
            "altKey": false,
            "metaKey": false,
            "button": 0,
            "buttons": 0,
            "relatedTarget": null
          }
        });
        await context.waitForPage();
        const html = context.getHtml();
        return html.includes('Verification Success... Hooray!');
      }else{
        console.log("NO CPATCHA FOUND!!");
      }
    } catch (error) {
  
      console.log('IN CATCH BLOCK: ', error); 
    }
    
  }
};
