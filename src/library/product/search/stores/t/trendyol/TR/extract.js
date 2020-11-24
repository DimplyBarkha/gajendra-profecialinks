const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    transform,
    zipcode: '',
    domain: 'trendyol.com',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return await Boolean(document.querySelector(currentSelector));
      }, selector);
    };
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    await context.evaluate(async function () {
      // @ts-ignore
      const getRating = [...document.querySelectorAll('div.ratings')];
      getRating.forEach(ele => {
        var stars = [...ele.querySelectorAll('div.full')];
        var sum = 0;
        stars.forEach(element => {
          var addition = element.getAttribute('style').match(/(\d+)/)[1];
          sum = sum + Number(addition);
        });
        var convertedfull = (((sum / 500) * 100) / 20).toFixed(1).replace(/(\d+)(\.)(\d+)/, '$1,$3');
        ele.setAttribute('sum', convertedfull);
      });
    });
    if (await checkExistance('.prdct-cntnr-wrppr > div:nth-child(13)')) {
      await context.evaluate(() => {
        document.querySelector('.prdct-cntnr-wrppr > div:nth-child(13)').scrollIntoView({ behavior: 'smooth' });
      });
    }
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
          await stall(1000);
          scrollTop += 250;
          window.scroll(0, scrollTop);
          if (scrollTop === 10000) {
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
    await applyScroll(context);
    await context.evaluate(async function () {
      const URL = window.location.href;
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div div.p-card-wrppr')[index];
        originalDiv.appendChild(newDiv);
        console.log('child appended ' + index);
      }
      const product = document.querySelectorAll('div div.p-card-wrppr');
      // select query selector and loop and add div
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('page_url', URL, i);
      }
    });
    await delay(5000);
    await context.waitForSelector('div.srch-prdcts-cntnr img');
    await delay(5000);
    return await context.extract(productDetails, { transform });
  },
};
