const { transform } = require('../TR/shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const isAdultPresent = await context.evaluate(() => {
    const adultDiv = document.querySelector('div[class="adult-product"]');
    if (adultDiv) {
      const currentUrl = window.location.href;
      adultDiv.click();
      return currentUrl;
    }
    return null;
  });
  if (isAdultPresent) {
    await context.waitForSelector('button[data-bind="click: adultAnswer.bind($data, 1)"]');
    await context.click('button[data-bind="click: adultAnswer.bind($data, 1)"]');
    await context.goto(isAdultPresent);
    await context.waitForSelector('ul.product-list.results-container.do-flex.list');
  }
  await context.evaluate(async function () {
    function timeout (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    document.querySelectorAll('span.ratings > span').forEach(item => {
      const per = item.getAttribute('style').match(/(\d+)/)[0];
      const rating = parseInt(per) * 5 / 100;
      item.setAttribute('aggregaterating', rating.toString());
    });
    document.querySelector('.product-list').setAttribute('url', window.location.href);
    await timeout(5000);

    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 50);
        });
      });
    }
    await autoScroll(context);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    transform,
    domain: 'hepsiburada.com',
    zipcode: '',
  },
  implementation,
};
