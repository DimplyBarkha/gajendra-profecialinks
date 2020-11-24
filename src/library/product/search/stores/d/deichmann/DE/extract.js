const { transform } = require("../format");

async function implementation(
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
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(async () => {
    //@ts-ignore
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('article.m-product-card-entry')[index];
      originalDiv.appendChild(newDiv);
    }
    const product = document.querySelectorAll('article.m-product-card-entry');
    
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      if(product[i].querySelector(".m-rating-stars")){
        var rlength = product[i].querySelector(".m-rating-stars").querySelectorAll("svg");
        var count = 0;
        rlength.forEach(x => {
          if(String(x.classList).indexOf("inactive") == -1){
            count += 1;
          }
        })
        addHiddenDiv('page_rating', count, i);
      }
      addHiddenDiv('page_url', window.location.href, i);
    }
  });
  
  
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'deichmann',
    transform,
    domain: 'deichmann.com',
    zipcode: '',
  },implementation
};
