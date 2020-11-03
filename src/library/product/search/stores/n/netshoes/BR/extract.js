const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
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
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });
  var results = await context.evaluate(async function () {
    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div.item-card')[index];
      originalDiv.appendChild(newDiv);
      console.log("child appended " + index);
    }
    const result = [];
    const product = document.querySelectorAll('div.item-card');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      addHiddenDiv('page_url', URL, i);
      const productUrl = document.querySelectorAll('div.item-card__images a');
      if (product[i].querySelector("section.ff-ajax-price") === null) {
        result.push({
          url: 'https:' + productUrl[i].getAttribute('href'),
          code: ''
        })
      } else {
        result.push({
          url: 'https:' + productUrl[i].getAttribute('href'),
          code: product[i].querySelector("section.ff-ajax-price").getAttribute("data-sku-ref")
        })
      }
    }
    return result;
  });

  for (var i = 0; i < results.length; i++) {
    console.log(results[i].url);
    if (results[i].code === '') {
      await context.goto(results[i].url, {
        timeout: 10000000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      const productCode = await context.evaluate(async function () {
        const productCode = document.querySelector("p.reference span").getAttribute("data-product-sku");
        return productCode;
      });
      results[i].code = productCode;
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    }
    console.log("result " + i + "--" + results[i].code)
  }
  const currentUrl = await context.evaluate(async function () {
    return document.URL;
  });
  try {
    await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
  } catch (error) {
    console.log('Error: ', error);
  }
  await context.evaluate(async function (results) {
    try {
      var index = 0;
      (document.querySelectorAll('div.item-card__images a')).forEach((node) => {
        node.setAttribute('data-product-code', results[0][index].code);
        index++;
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }, [results]);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'netshoes',
    transform: transform,
    domain: 'netshoes.com.br',
    zipcode: "''",
  },
  implementation,
};
