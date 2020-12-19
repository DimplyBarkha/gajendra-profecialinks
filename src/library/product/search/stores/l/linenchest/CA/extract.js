const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    transform: transform,
    domain: 'linenchest.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const mainUrl = await context.evaluate(async function () {
      return document.URL;
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(3000);
          scrollTop += 500;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
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
      (document.querySelectorAll('ol.ais-Hits-list li.ais-Hits-item a')).forEach((elem) => {
        result.push({
          url: elem.getAttribute('href'),
          code: '',
        });
      });
      return result;
    });

    const maxCount = results.length;

    for (var i = 0; i < maxCount; i++) {
      const detailPageUrl = results[i].url;
      await context.goto(detailPageUrl, {
        timeout: 10000000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      const productCode = await context.evaluate(async function () {
        const productCode = productInfoObject.productSku;
        return productCode;
        console.log(productCode);
      });
      results[i].code = productCode;
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    };
    await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
    // await applyScroll(context);
    await context.evaluate(async function (results) {
      try {
        var index = 0;
        (document.querySelectorAll('ol.ais-Hits-list li.ais-Hits-item a')).forEach((node) => {
          node.setAttribute('data-product-code', results[0][index].code);
          index++;
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    }, [results]);
    return await context.extract(productDetails, { transform });
  },
};
