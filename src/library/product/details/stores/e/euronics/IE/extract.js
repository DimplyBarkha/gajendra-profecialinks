async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms)
    })
  }

  await context.waitForXPath('//a[@class="img-link-block"]');
  await context.click('.img-link-block');
  await stall(4000);

  await context.evaluate(function() {

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const alternateImages = [];
    document.querySelectorAll('.jcarousel-item').forEach(e => {
      if (e.querySelector('img')) {
        alternateImages.push(el.querySelector('img').getAttribute('srcset'));
      }
    })
    addHiddenDiv('alternateImages', alternateImages.join(' | '));
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);
    if (document.querySelector('.product-price.hide-for-small')) {
      if (document.querySelector('.product-price.hide-for-small').querySelector('.oldprice')) {
        addHiddenDiv('listPrice', document.querySelector('.product-price.hide-for-small').querySelector('.oldprice').innerText.split(' ')[1]);
        addHiddenDiv('price', document.querySelector('.product-price.hide-for-small').innerText.trim().split(' ')[1]);
      } else {
        addHiddenDiv('listPrice', document.querySelector('.product-price.hide-for-small').innerText.trim());
        addHiddenDiv('price', document.querySelector('.product-price.hide-for-small').innerText.trim());
      }
    }

  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'euronics',
    transform: null,
    domain: 'euronics.ie',
  },
  implementation,
};
