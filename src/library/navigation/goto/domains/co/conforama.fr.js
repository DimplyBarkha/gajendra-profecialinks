
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'conforama.fr',
    timeout: 90000,
    country: 'FR',
    store: 'conforama',
    first_request_timeout: 90000,
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url)
    try {
    let Captcha = await context.waitForSelector('div.g-recaptcha');
    console.log('Captcha: ', Captcha);
    if(Captcha){
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
    console.log('error: ', error);
    }
    
    }
  
};
