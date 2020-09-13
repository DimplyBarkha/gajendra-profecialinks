const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const skuArr = await context.evaluate(function () {
    const resultArr = [];
    const items = document.querySelectorAll('.product-item.product-card');
    for (let i = 0; i < items.length; i++) {
      resultArr.push(items[i].getAttribute('data-test-id').replace('product-item:', ''));
    }
    return resultArr;
  });
  const pageUrl = await context.evaluate(function () {
    return window.location.href;
  });
  const dataArr = [];

  if (skuArr) {
    await context.goto('https://mark.reevoo.com#[!opt!]{"type":"js","init_js":""}[/!opt!]', { timeout: 20000, waitUntil: 'load', checkBlocked: true });

    for (let i = 0; i < skuArr.length; i++) {
      // https://mark.reevoo.com/reevoomark/product_summary?locale=en-GB&sku=330V8ANIMAL&trkref=ERN&variant=NewStars&callback=ReevooLib.Data.callbacks
      // await context.goto(`https://mark.reevoo.com/reevoomark/product_summary?locale=en-GB&sku=${skuArr[i]}&trkref=ERN&variant=NewStars&callback=ReevooLib.Data.callbacks`);
      let text = await context.evaluate(async function (sku) {
        return await fetch(`https://mark.reevoo.com/reevoomark/product_summary?locale=en-GB&sku=${sku}&trkref=ERN&variant=NewStars&callback=ReevooLib.Data.callbacks`)
          .then(response => response.text());
      }, skuArr[i]);
      console.log(`Fetch text ${text}`);
      if (text) {
        text = text.substring(text.indexOf('{')).replace('})', '}');
        dataArr.push(text);
      }
    }
  }
  await context.goto(pageUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
  if (dataArr) {
    try {
      for (let i = 0; i < dataArr.length; i++) {
        await context.evaluate(function (text) {
          function addHiddenDiv (el, id, text) {
            const div = document.createElement('div');
            div.classList.add(id);
            div.innerHTML = text;
            el.appendChild(div);
          }
          const data = JSON.parse(text);
          console.log(data);
          const item = document.evaluate(`//div[@data-test-id="product-item:${data.sku}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (item) {
            addHiddenDiv(item, 'rating', data.average_score / 2);
            addHiddenDiv(item, 'reviews', data.review_count);
            addHiddenDiv(item, 'id', data.sku);
          }
        }, dataArr[i]);
      }
    } catch (exception) {
      console.log(exception);
    }
  }
  return context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    transform: transform,
    domain: 'euronics.co.uk',
  },
  implementation,
};
