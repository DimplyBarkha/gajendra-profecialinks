const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuyCA',
    transform: transform,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const {url, id } = inputs;
    if (id) {
      // eslint-disable-next-line no-inner-declarations
      async function firstItemLink () {
        return await context.evaluate(function () {
          let firstItem = document.querySelector('a[itemprop="url"]');
          firstItem = firstItem ? firstItem.href : '';
          return firstItem;
        });
      }
    }
    // ------------------------------------------------------------
    // await context.waitForSelector('img[class="middle_1qXv8"]');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let videoLinkArr = [];
      const videos = document.querySelectorAll('img[class="middle_1qXv8"]');
      for (let index = 0; index < videos.length; index++) {
        // @ts-ignore
        let element = videos[index];
        element = element.previousElementSibling;
        // @ts-ignore
        element = element ? element.src : '';
        console.log('element: ', element);
        // @ts-ignore
        if (element.includes('https://i1.ytimg.com/vi/')) {
          // @ts-ignore
          let videoLink = element.replace(/https:\/\/i1\.ytimg\.com\/vi\/(.*)\/default.jpg/, '$1');
          videoLink = 'https://www.youtube.com/watch?v=' + videoLink + '&feature=youtu.be';
          videoLinkArr.push(videoLink);
        }
      }
      // @ts-ignore
      videoLinkArr = videoLinkArr.join(' | ');
      addElementToDocument('bb_videos', videoLinkArr);
    });
    // ------------------------------------------------------------------------------
    //  await context.evaluate(async function () {
    //   const buttonSelector2 = 'button#whatsIncluded';
    //   let available = document.querySelector(buttonSelector2);
    //   // @ts-ignore
    //   available = available ? available.click() : '';
    //  });
    //  try {
    //    await context.waitForSelector('div#whatsIncluded ul li');
    //  } catch (error) {
    //   console.log("whatsIncluded description not loaded");
    //  }
    // ------------------------------------------------------------------------
    //  await context.evaluate(async function () {
    //  let otherInfoArr = [];
    //  let otherInfo = document.querySelector('button#whatsIncluded');
    //  // @ts-ignore
    //  otherInfo = otherInfo ? otherInfo.click() : '';
    //  let otherInfoTxt = document.querySelectorAll('div#whatsIncluded ul li');
    //  for (let index = 0; index < otherInfoTxt.length; index++) {
    //    // @ts-ignore
    //    const element = otherInfoTxt[index].innerText;
    //    otherInfoArr.push(" | "+element);
    //  }
    //  // @ts-ignore
    //  otherInfoArr = otherInfoArr.join('');
    //  addElementToDocument('bb_productOtherInformation', otherInfoArr);
    // ------------------------------------------------------------------------------
    //    function addElementToDocument (key, value) {
    //     const catElement = document.createElement('div');
    //     catElement.id = key;
    //     catElement.textContent = value;
    //     catElement.style.display = 'none';
    //     document.body.appendChild(catElement);
    //   }
    //  });

    return await context.extract(productDetails, { transform });
  },
};
