const { transform } = require('../format.js');
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
  console.log('mainUrl', mainUrl);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  var results = await context.evaluate(async function () {
    const result = [];
    (document.querySelectorAll('div.contentGrid ul li a.productimage')).forEach((elem) => {
      result.push({
        url: `https://salonsupplies.co.uk${elem.getAttribute('href')}`,
        code: '',
      });
    });
    return result;
  });
  console.log('Results   : ', results);
  for (var i = 0; i < results.length; i++) {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.goto(results[i].url, {
      timeout: 10000000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const productCode = await context.evaluate(async function () {
      const productCode = document.querySelector('div#price p span:nth-child(2)').innerText.split(':')[1].trim();
      return productCode;
    });
    results[i].code = productCode;
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  };
  // var productcodes = [];
  // results.map((item) => {
  //   productcodes.push(item.code);
  // });
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
 
  await context.evaluate(async function (results) {
    document.querySelectorAll('div.contentGrid ul li').forEach((node, index) => {
      node.setAttribute('data-product-code', results[index].code);
    });
  }, results);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'salonsupplies',
    transform: transform,
    domain: 'salonsupplies.co.uk',
    zipcode: "''",
  },
  implementation,
};
