const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.se',
    zipcode: '',
  },

  //   implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {

  //     await context.waitForSelector('div#wrp_loadbee div#content_loadbee div.loadbee-page');
  //     await context.waitForSelector('div#wrp_flixmedia div.wrapper_flixmedia div.flix-inpage');

  //     const manufacturerInfo = await context.evaluate(function () {
  //       return !!document.querySelector('button#more_flixmedia');
  //     });

  //     async function autoScroll () {
  //       await context.evaluate(async function () {
  //         await new Promise((resolve, reject) => {
  //           var totalHeight = 0;
  //           var distance = 100;
  //           var timer = setInterval(() => {
  //             var scrollHeight = document.body.scrollHeight;
  //             window.scrollBy(0, distance);
  //             totalHeight += distance;

  //             if (totalHeight >= scrollHeight) {
  //               clearInterval(timer);
  //               resolve();
  //             }
  //           }, 100);
  //         });
  //       });
  //     }
  //     if (manufacturerInfo) {
  //       await new Promise(resolve => setTimeout(resolve, 10000));
  //       autoScroll();
  //       await context.waitForSelector('div#flix-inpage');
  //       // await context.waitForSelector('a.view-more-trigger');
  //       // if (loadMoreManufacturer) {
  //       //   await context.waitForSelector('div.wc-fragment');
  //       // }
  //     }

  //     // await context.waitForSelector('button#more_flixmedia');
  //     await context.evaluate(async function () {
  //       // var elmnt = document.querySelector('div#wrp_flixmedia');
  //       // elmnt.scrollIntoView();

  //       // if (document.querySelector('button#more_flixmedia')) {
  //       //   document.querySelector('button#more_flixmedia').click();
  //       // }
  //       function getEleByXpath (xpath) {
  //         const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //         console.log('Element' + element);
  //         const text = element ? element.textContent : null;
  //         return text;
  //       }

  //       function addHiddenDiv (id, content) {
  //         const newDiv = document.createElement('div');
  //         newDiv.id = id;
  //         newDiv.textContent = content;
  //         newDiv.style.display = 'none';
  //         document.body.appendChild(newDiv);
  //       }

  //       // if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
  //       //   document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
  //       // }

  //       // if (document.querySelectorAll('li.thumbnail-carousel__thumbnail div.demoupUI-playbutton').length) {
  //       //   const videosTiles = document.querySelectorAll('li.thumbnail-carousel__thumbnail div.demoupUI-playbutton');
  //       //   const videos = [];
  //       //   [...videosTiles].forEach((element) => {
  //       //     // const videoButton = element.querySelector('a');
  //       //     videoButton.click();
  //       //     const vidLink = getEleByXpath('//iframe[contains(@src,"youtube")]/@src');
  //       //     videos.push(vidLink);
  //       //     document.querySelector(".overlay-bg").click();
  //       //   });
  //       //   addHiddenDiv('ii_videos', videos.join(' || '));
  //       // }
  //     });
  //     // await context.waitForSelector('div#wrp_loadbee div#content_loadbee div.loadbee-page');
  //     // await context.waitForSelector('div#wrp_flixmedia div.wrapper_flixmedia div.flix-inpage');

  //     // await context.click('button#more_flixmedia');

//     await context.extract(productDetails, { transform });
//   },
};
