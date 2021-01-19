const { transform } = require('../../../../shared');
async function implementation (
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
        await stall(1200);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(2000);
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
  await context.evaluate(async function () {
    const URL = window.location.href;
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('article[data-selector=" splp-prd-tl-dsktp"]')[index];
      originalDiv.appendChild(newDiv);
      console.log('child appended ' + index);
    }
    const product = document.querySelectorAll('article[data-selector=" splp-prd-tl-dsktp"]');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      addHiddenDiv('page_url', URL, i);
    }
    function addHiddenDivDetails (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelector('div.style__ProductDetailsWrapper-PDP__sc-18s9jld-0');
      originalDiv.appendChild(newDiv);
    }
    const wholeDiv = document.querySelector('div.style__ProductDetailsWrapper-PDP__sc-18s9jld-0');
    console.log('s', wholeDiv);
    if (wholeDiv) {
      const url = window.location.href;
      addHiddenDivDetails('Prod_url', url);
      addHiddenDivDetails('Search_url', url);
      const thumbnailDetails = document.querySelector('img.met-epc-item');
      // @ts-ignore
      thumbnailDetails && thumbnailDetails.src && addHiddenDivDetails('thumbnailDetails', thumbnailDetails.src);
      const bits = url.split('/');
      const idDetails = bits[bits.length - 1];
      addHiddenDivDetails('idDetails', idDetails);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: transform,
    domain: 'lowes.com',
    zipcode: '',
  },
  implementation,
};
