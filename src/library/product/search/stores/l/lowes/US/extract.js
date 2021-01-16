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
    function addHiddenDiv_Details (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelector('div.style__ProductDetailsWrapper-PDP__sc-18s9jld-0');
      originalDiv.appendChild(newDiv);
    }
      let wholeDiv = document.querySelector('div.style__ProductDetailsWrapper-PDP__sc-18s9jld-0')
     console.log('s' , wholeDiv);
      if(wholeDiv) {
        let url = window.location.href
        addHiddenDiv_Details('Prod_url' , url)
        addHiddenDiv_Details('Search_url' , url)
        let thumbnail_details = document.querySelector('img.met-epc-item').src
        addHiddenDiv_Details('thumbnail_details' , thumbnail_details)
        let bits = url.split("/");
        let id_details = bits[bits.length-1];
        addHiddenDiv_Details('id_details' , id_details)

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
