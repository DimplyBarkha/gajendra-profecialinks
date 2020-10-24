const { transform } = require('../transfer');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });
  console.log('mainUrl', mainUrl);
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


  var results = await context.evaluate(async function () {
    const result = [];
    (document.querySelectorAll('div .shop-results a')).forEach((elem) => {
      result.push({
        url: elem.getAttribute('href'),
        code: ''
      })
    })
    return result;
  });
  for (var i = 0; i < results.length; i++) {
    await context.goto(results[i].url, {
      timeout: 10000000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const productCode = await context.evaluate(async function () {
      const productCode = window.deviceJson.sku
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
  await applyScroll(context);
  await context.evaluate(async function (results) {
    try {
      var index = 0;
      (document.querySelectorAll('div .shop-results a')).forEach((node) => {
        node.setAttribute('productCode', results[0][index].code);
        index++;
      });
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('document-url', document.URL);

    } catch (error) {
      console.log('Error: ', error);
    }
  }, [results]);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'o2',
    transform,
    domain: 'o2.co.uk',
    zipcode: '',
  },
  implementation
};
