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

    const mainUrl = await context.evaluate(async function () {
      return document.URL;
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(2000);
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
    await applyScroll(context);
    var results = await context.evaluate(async function () {
      const result = [];
      (document.querySelectorAll('div.prdct-cntnr-wrppr div a')).forEach((elem) => {
        result.push({
          url: elem.getAttribute('href'),
          code: '',
        });
      });
      return result;
    });

    const maxCount = results.length > 150 ? 150 : results.length;

    for (var i = 0; i < maxCount; i++) {
      const detailPageUrl = results[i].url.includes('https://www.trendyol.com/') ? results[i].url : `https://www.trendyol.com/${results[i].url}`;
      await context.goto(detailPageUrl, {
        timeout: 10000000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      const productCode = await context.evaluate(async function () {
        const productCode = window.__PRODUCT_DETAIL_APP_INITIAL_STATE__.product.productCode;
        return productCode;
      });
      results[i].code = productCode;
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    };
    // var productcodes = [];
    // results.map((item) => {
    //   productcodes.push(item.code);
    // });

    await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
    //await applyScroll(context);
    await context.evaluate(async function (results) {
      try {
        var index = 0;
        (document.querySelectorAll('div.prdct-cntnr-wrppr div a')).forEach((node) => {
          node.setAttribute('data-product-code', results[0][index].code);
          index++;
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    }, [results]);
    await delay(5000);
    await context.waitForSelector('div.srch-prdcts-cntnr img');
    await delay(5000);
    return await context.extract(productDetails, { transform });
  },
};
