var { transform } = require('../format');

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
      while (scrollTop !== 20000) {
        await stall(900);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
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
  var searchLength = await context.evaluate(async () => {
    //@ts-ignore
    return Math.ceil(parseInt(document.querySelector("div.listing_header_bar").innerText.split(" ")[0]) / 36);
  });

  var mainUrl = await context.evaluate(async () => {
    //@ts-ignore
    return window.location.href;
  });

  var searchUrl = await context.evaluate(async () => {
    //@ts-ignore
    return document.querySelector("a.next_and_prev_button") ? document.querySelector("a.next_and_prev_button").getAttribute("href") : "";
  });
  
  for(var i=1;i<= searchLength;i++){
    if(searchLength == 1){
      await applyScroll(context); 
      continue;
    }
    if (searchUrl != ""){
      searchUrl = searchUrl.split("page=")[0] + "page=" + i
    }
    else
    {
      searchUrl = mainUrl;
    }
    await context.goto(searchUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async () => {
      //@ts-ignore
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('.product_listing_single_row_wrapper')[index];
        originalDiv.appendChild(newDiv);
      }
      const product = document.querySelectorAll('.product_listing_single_row_wrapper');
      // select query selector and loop and add div
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('page_url', window.location.href, i);
      }
    });
    await applyScroll(context);  
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    if (i !== searchLength) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
  }
  
  
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    transform,
    domain: 'apodiscounter.de',
    zipcode: '',
  },
  implementation
};
