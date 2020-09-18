const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let videoSelector = null;
    await context.evaluate(async function () {
      let videoEle = document.querySelector("a[data-test='product-video']")
      if (videoEle) {
        videoEle.click();
        console.log('video clicked')
        videoSelector = "video[data-test='wsp-video-element']";
      }
    });

    try {
      await context.evaluate(async function () {
        const ulInDesc = "div[data-test='description']>ul";
        const descBullets = document.querySelector(ulInDesc);
        const body = document.querySelector('body');

        let liInDesc = document.querySelectorAll("div[data-test='description']>ul>li")
        let divEle = document.createElement('div')
        liInDesc.length > 0 ? body.appendChild(divEle) : false;
        divEle.id = 'bulletCount';
        divEle.title = liInDesc.length.toString();
        
        if (descBullets) {
          body.appendChild(descBullets);
        }
      })
    } catch (err) {
      console.log(err.message)
    }
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};


  