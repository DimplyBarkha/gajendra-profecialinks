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

    async function scrollToRec (node) {
      await context.evaluate(async (node) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, node);
    }
    await scrollToRec('div#syndi_powerpage');
    await scrollToRec('div#productSpecificationsContainer');
    await scrollToRec('div.syndi_powerpage');

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

      const inTheBoxNode = document.querySelector('div.syndi_powerpage');
      let inTheWITB = false;

      if (inTheBoxNode) {
        const inTheBox = inTheBoxNode.shadowRoot ? inTheBoxNode.shadowRoot : null;
        if (inTheBox) {
          [...inTheBox.querySelectorAll('h2.syndigo-widget-section-header')].forEach(element => {
            const ifInTheBoxTitle = element ? (element.innerText.includes('In the Box') || element.innerText.includes('In The Box')) : false;
            if (ifInTheBoxTitle) {
              const inTheBoxContent = element.parentElement.querySelector('div.syndigo-featureset-layout');
              const inTheBoxImg = inTheBoxContent.querySelectorAll('img');
              [...inTheBoxImg].forEach((element) => {
                addHiddenDiv('ii_inTheBoxUrls', element.src);
              });
              const inTheBoxText = inTheBoxContent.querySelectorAll('h3.syndigo-featureset-feature-caption');
              [...inTheBoxText].forEach((element) => {
                if (element.innerText.length) {
                  let inTheWITB = true;

                  addHiddenDiv('ii_inTheBoxText', element.innerText);
                  console.log("here the output uddp.....",element.innerText)
                }
              });

            if (inTheWITB){


              const all_h3 = document.querySelector('#DT_Features').children;
              let start = false
              for(let i =0; i< all_h3.length; i++)
              {
                 if( all_h3[i].textContent.includes('In The Box:') )
                 {
                    start = true;
                 }
                 if (start)
                 {
                    addHiddenDiv('iii_inTheBoxText', all_h3[i].textContent);

                 }

              }
            }


            }
          });
        }
      }
    }, src);

    return await context.extract(productDetails, { transform });
  },
};
