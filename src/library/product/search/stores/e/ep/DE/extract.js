async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall (ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  let results = [];
  await stall(2000);

  while (true) {
    await context.evaluate(async function () {
      function addHiddenDiv (el, myClass, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', myClass);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        el.appendChild(newDiv);
      }

      if (document.querySelector('.cookies-overlay-dialog__accept-all-btn')) {
        document.querySelector('.cookies-overlay-dialog__accept-all-btn').click();
      }

      document.querySelectorAll('.cmsproductlist-desktop-layout-item').forEach(el => {
        addHiddenDiv(el, 'url', 'https://ep.de' + el.querySelector('a').getAttribute('href'));
        const splitUrl = el.querySelector('a').getAttribute('href').split('/');
        addHiddenDiv(el, 'id', splitUrl[splitUrl.length - 2]);
        if (el.querySelector('.priceOfProduct')) {
          addHiddenDiv(el, 'price', el.querySelector('.priceOfProduct').innerText.replace('*', ''));
        }
      });
    });
    const extract = await context.extract(productDetails, { transform });
    results = [...results, extract];
    const hasNextBtn = await context.evaluate(function () {
      return document.querySelector('a[rel="next"]');
    });
    if (hasNextBtn) {
      await context.click('a[rel="next"]');
      await stall(2000);
    } else {
      break;
    }
  }

  return results;
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'ep',
    transform: transform,
    domain: 'ep.de',
  },
  implementation,
};
