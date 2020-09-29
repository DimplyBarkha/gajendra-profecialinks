const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const allResults = [];

  const resultsArr = await context.evaluate(async function () {
    const results = [];

    let scrollTop = 0;
    while (scrollTop < 5000) {
      scrollTop += 500;
      window.scroll(0, 500);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    document.querySelectorAll('.g-wrap').forEach((el, ind) => {
      if (results.length >= 150) {
        return;
      }
      if (el.querySelector('h3')) {
        const name = el.querySelector('h3').innerText;
        const id = ind + 1;
        const thumbnail = el.querySelector('img').getAttribute('src');
        const url = el.querySelector('a').getAttribute('href');
        results.push({
          name,
          id,
          thumbnail,
          url,
          searchUrl: window.location.href,
        });
      }
    });
    return results;
  });

  for (const result of resultsArr) {
    await context.goto(result.url);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await context.evaluate(async function (result) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('name', result.name);
      addHiddenDiv('productUrl', result.url);
      addHiddenDiv('thumbnail', result.thumbnail);
      addHiddenDiv('added-searchurl', result.searchUrl);
      const skuScript = document.evaluate('//script[contains(text(),"SKU")]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      if (skuScript && skuScript.singleNodeValue) {
        addHiddenDiv('id', skuScript.singleNodeValue.innerText.match(/productSKU: "(.*)",/)[1]);
      }
    }, result);
    const extract = await context.extract(productDetails, { transform });
    allResults.push(extract);
  }
  return allResults;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    transform,
    domain: 'dyson.in',
    zipcode: '',
  },
  implementation,
};
