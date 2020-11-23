const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  //await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  const mainUrl = await context.evaluate(async function () {
    var el = document.querySelector('div.journey-reminder-header span');
    if (el && el.innerText === "Paris")
      return undefined;
    else
      return document.URL;
  });
  console.log('mainUrl', mainUrl)
  if (mainUrl) {
    await context.goto('https://www.auchan.fr/courses', {
      timeout: 10000000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const isAlreadyIndifferentStore = await context.evaluate(async function () {
      var el = document.querySelector('button.journey-reminder__initial-choice-button');
      if (el)
        return false
      else
        return true;
    });
    if (isAlreadyIndifferentStore) {
      await context.waitForSelector('.journey-reminder__footer button.layer__trigger_journey-reminder')
      await context.click('.journey-reminder__footer button.layer__trigger_journey-reminder')
    } else {
      await context.waitForSelector('button.journey-reminder__initial-choice-button')
      await context.click('button.journey-reminder__initial-choice-button')
    }
    await context.waitForSelector('input.journeySearchInput')
    await context.setInputValue('input.journeySearchInput', '75020');
    await context.waitForSelector('li.journey__search-suggest')
    await context.click('li.journey__search-suggest')
    await context.waitForSelector('.journey-offering-context__wrapper .journey-offering-context__actions button')
    await context.click('.journey-offering-context__wrapper .journey-offering-context__actions button')
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'networkidle0', checkBlocked: true });
  }
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}



module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    transform: transform,
    domain: 'auchan.fr',
    zipcode: '',
  },
  implementation
};
