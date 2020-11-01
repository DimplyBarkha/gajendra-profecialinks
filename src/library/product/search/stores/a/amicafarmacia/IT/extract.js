const { transform } = require('./format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
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

  const getSKU = async function (context) {
    const mainUrl = await context.evaluate(async function () {
      return document.URL;
    });
    console.log('mainUrl', mainUrl);
    await applyScroll(context);
  
    var results = await context.evaluate(async function () {
      const result = [];
      (document.querySelectorAll('button.stock.unavailable')).forEach((elem) => {
        result.push({
          url: elem.parentElement.getAttribute('href'),
          code: ''
        });
      });
      return result;
    });
  
    for (var i = 0; i < results.length; i++) {
      console.log(`URL: ${results[i].url}`);
      await context.goto(results[i].url, {
        timeout: 10000000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      const productCode = await context.evaluate(async function () {
        const productCode = document.querySelector("[itemprop='sku']").textContent;
        return productCode;
      });
      results[i].code = productCode;
      console.log(`SKU: ${productCode}`);
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    };
  
    await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
    await applyScroll(context);
    await context.evaluate(async function (results) {
      try {
        var index = 0;
        (document.querySelectorAll('button.stock.unavailable')).forEach((node) => {
          const newDiv = document.createElement('input');
          newDiv.type = 'hidden';
          newDiv.name = 'product';
          newDiv.value = results[0][index].code;
          node.parentElement.appendChild(newDiv);
          index++;
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    }, [results]);
  };
  
  await getSKU(context);
  await applyScroll(context);
  return await context.extract(productDetails, {transform});
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    transform,
    domain: 'amicafarmacia.com',
    zipcode: "''",
  },
  implementation
};
