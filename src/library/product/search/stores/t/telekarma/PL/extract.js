const { transform } = require('../format');

async function implementation (
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
  console.log(mainUrl, 'MainURL');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  var results = await context.evaluate(async function () {
    const result = [];
    (document.querySelectorAll('div.contentPadding table tbody tr td.pad_lista_prod a')).forEach((elem) => {
      result.push({
        url: elem.getAttribute('href'),
        price: '',
      });
    });
    return result;
  });
  console.log('Results', results);
  for (var i = 0; i < results.length; i++) {
    await context.goto(results[i].url, {
      timeout: 10000000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const price = await context.evaluate(async function () {
      const element = document.evaluate('//div[contains(@id,"productCardPrice")]//span[@class="productCardPrice-price"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log(element);
      if (element && element.singleNodeValue) {
        const price = element.singleNodeValue;
        return price ? price.textContent : '';
      } else {
        return '';
      }
    });
    results[i].price = price;
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  };
  await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
  // Product Price
  await context.evaluate(async function (results) {
    try {
      var index = 0;
      (document.querySelectorAll('div.contentPadding table tbody tr td.pad_lista_prod a')).forEach((node) => {
        node.setAttribute('data-price', results[0][index].price);
        index++;
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }, [results]);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'telekarma',
    transform: transform,
    domain: 'telekarma.pl',
    zipcode: "''",
  },
  implementation,
};
