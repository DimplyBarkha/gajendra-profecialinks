const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('#eky-dyson-iframe');
    const src = iframe ? iframe.src : '';
    return src;
  });
  if (src) {
    try {
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    } catch (error) {
      try {
        await context.evaluate(async function (src) {
          window.location.assign(src);
        }, src);
        await context.waitForSelector('div#no-parallax');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (err) {
        console.log(err);
      }
    }
  }
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const specsArrSelector = document.querySelectorAll('table.flix-std-specs-table td');
    if (specsArrSelector) {
      const specsArr = [];
      for (let i = 0; i < specsArrSelector.length; i++) {
        specsArr.push(specsArrSelector[i].querySelector('div.flix-value').innerText + ': ' + specsArrSelector[i].querySelector('div.flix-title').innerText);
        addHiddenDiv('specsArr', specsArr[i]);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'noelleeming',
    transform,
    domain: 'noelleeming.co.nz',
    zipcode: '',
  },
  implementation,
};
