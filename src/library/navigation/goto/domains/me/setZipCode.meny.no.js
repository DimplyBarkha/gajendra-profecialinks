
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'NO',
    domain: 'meny.no',
    store: 'meny',
    zipcode: ' ',
  },
  implementation: async ( inputs, { country, domain, timeout }, context, dependencies) => {
    await context.waitForSelector('head>link[rel="canonical"]');
    const newUrl = await context.evaluate(function () {
      const tempUrl = document.querySelector('head>link[rel="canonical"]');
      if (tempUrl) {
        return `${tempUrl.getAttribute('href')}`;
      }
    });
    console.log('code is executing');
    console.log(inputs);
    // console.log(inputs+`postcode${zipcode}`);
    const url = newUrl;
    await context.waitForSelector('div[class*="topmenu__secondary"]>div[class*="topmenu__order"]>span[class*="topmenu__order"]>.ws-handover-picker>div>button>span');
    await context.click('div[class*="topmenu__secondary"]>div[class*="topmenu__order"]>span[class*="topmenu__order"]>.ws-handover-picker>div>button>span');
    await context.waitForSelector('fieldset>div>div:nth-child(2)>[class*="ws-radio-item"]>span:nth-child(2)');
    await context.click('fieldset>div>div:nth-child(2)>[class*="ws-radio-item"]>span:nth-child(2)');
    await context.waitForSelector('div[class*="street-name"]>div[class*="ngr-input-group"]>[class="ngr-input"]>input');
    await context.setInputValue('div[class*="street-name"]>div[class*="ngr-input-group"]>[class="ngr-input"]>input', `5081`);
    await context.waitForSelector('ul[class*="ngr-autocomplete__menu"]>li:nth-child(1)');
    await context.click('ul[class*="ngr-autocomplete__menu"]>li:nth-child(1)');
    await context.waitForSelector('div[class*="house-number"]>div[class*="ngr-input-group"]>[class="ngr-input"]>input');
    await context.click('div[class*="house-number"]>div[class*="ngr-input-group"]>[class="ngr-input"]>input');
    await context.waitForSelector('ul[id*="house-number"]>li:nth-child(1)');
    await context.click('ul[id*="house-number"]>li:nth-child(1)');
    await context.waitForSelector('[class="ngr-button"]>span');
    await context.click('[class="ngr-button"]>span');
    await context.waitForSelector('div[class*="ngr-button-group"]>button:nth-child(1) >[class="ngr-button__text"]');
    await context.click('div[class*="ngr-button-group"]>button:nth-child(1) >[class="ngr-button__text"]');
    await context.waitForSelector('div[class="ngr-modal__footer"]>button:nth-child(2)>[class="ngr-button__text"]');
    await context.click('div[class="ngr-modal__footer"]>button:nth-child(2)>[class="ngr-button__text"]');
    await context.waitForSelector('[class="ngr-modal__footer"]>button>span');
    await context.click('[class="ngr-modal__footer"]>button>span');
   
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
