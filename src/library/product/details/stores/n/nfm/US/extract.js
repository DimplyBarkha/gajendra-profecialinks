const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'nfm',
    transform,
    domain: 'nfm.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    try {
      console.log('waiting for price div');
      await context.waitForSelector('span#DT_ProductPrice', {timeout: 30000});
    } catch(err) {
      console.log('got some error while for the price div', err);
    }

    try {
      await context.evaluate(async function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        console.log('if we can get the global variable');
        if (typeof dataModel !== 'undefined') {
            // the variable is defined
            console.log('data model -  the global variable is defined');
            if(dataModel.hasOwnProperty('priceData')) {
              if (typeof dataModel.priceData !== 'undefined' && dataModel.priceData.hasOwnProperty('price')) {
                console.log('price present globally is - $' + dataModel.priceData.price);
                addHiddenDiv('price', ('$' + dataModel.priceData.price));
              } else {
                console.log('display data has no price prop in it');
              }
            } else {
              console.log('we do not have any property named as display data in dataModel');
            }

          } else {
            console.log('data model - the global variable is not defined');
          }
      });
    } catch (err) {
      console.log('got some error while extracting price from global variable');
    }

    const src = await context.evaluate(async function () {
      const iframeDoc = document.querySelector('#wcframable1-0');
      const iframe = iframeDoc ? iframeDoc.contentDocument : '';
      const src = iframe ? iframe.querySelector('#vjs_video_1_html5_api') ? iframe.querySelector('#vjs_video_1_html5_api').getAttribute('src') : '' : '';
      return src;
    });
    await context.evaluate(async function (src) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('videosExtracted', src);
    }, src);

    return await context.extract(productDetails, { transform });
  },
};
