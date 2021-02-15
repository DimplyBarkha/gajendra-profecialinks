// const { addAlias } = require('module-alias');
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    transform: transform,
    domain: 'otto.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      let scrollTop = 0;
      // function addHiddenDiv(id, content, index) {
      //   const newDiv = document.createElement('div');
      //   newDiv.id = id;
      //   newDiv.textContent = content;
      //   newDiv.style.display = 'none';
      //   //const originalDiv = document.querySelectorAll('#san_resultSection > article')[index];
      //   const originalDiv = document.querySelectorAll("script[type='application/ld+json']")[index];
      //   originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      // }


      try {
        while (scrollTop !== 20000) {
          await stall(1000);
          var aa = document.querySelectorAll("span[class='name']");
          //var az = document.querySelectorAll("li[id='san_pagingBottomNext'] button");
          if (aa != null) {
            for (var i = 0; i < aa.length; i++) {
              console.log('h', i)
            }
          }
          var body = document.body,
            html = document.documentElement;

          var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
          
          if (height>=scrollTop){
            scrollTop += 500;
            window.scroll(0, scrollTop);
          }
          else {
            break;
          }

          if (scrollTop === 20000) {
            await stall(2000);
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
      }
      catch (error) { }

    });
    return await context.extract(productDetails, { transform });
  },
};