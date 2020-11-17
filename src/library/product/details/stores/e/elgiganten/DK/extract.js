
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'elgiganten',
    transform,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const hasBtn = await context.evaluate(async function () {
      return Boolean(document.querySelector('button.coi-banner__accept'));
    });

    if (hasBtn) {
      try{
      await context.click('button.coi-banner__accept');
      }
      catch(exception){
        console.log('Unable to click accept button')
      }
    }
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
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    try {
      await context.waitForSelector('iframe.videoly-box', { timeout: 30000 });
      await context.evaluate(()=>{
        let videoData = [...document.querySelector('iframe.videoly-box').contentDocument.querySelectorAll('ul.b-video-list li  div.b-video-item-tile')];
        let videoArr=[];
        for(let i = 0 ; i < videoData.length ; i++){
          console.log('video number', i+1);
          videoArr.push('https://www.youtube.com/watch?v='+videoData[i].getAttribute('data-videoid'));
        }
        let videos = videoArr.join(' | ');
        document.querySelector('body').setAttribute('video-src',videos);
      })
    } catch (error) {
      console.log('No video ');
    }  
    
    try{
      await context.waitForSelector('a[data-template="ProductSpecificationTab"], #product-read-more-specs');
      await context.click('a[data-template="ProductSpecificationTab"],  #product-read-more-specs');
    }catch(e){
      console.log('Specification not present');
    }

    // await context.evaluate(async function () {
    //   const videoData = document.querySelectorAll('iframe.videoly-box').length > 1 ? document.querySelectorAll('iframe.videoly-box')[0].contentWindow.document.getElementsByTagName('ul')[0] : null;
    //   if (videoData) {
    //     document.body.appendChild(videoData);
    //   }
    // });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
