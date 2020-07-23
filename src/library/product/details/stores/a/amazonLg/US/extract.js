const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    transform: transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const element = document.getElementById('aplus');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise((resolve) => setTimeout(resolve, 2197));
      }
      try {
        await context.waitForXPath('//div[@id="aplus"]/..//h2 | //div[@id="aplus"]/..//div[contains(@class, "celwidget aplus-module")]');
      } catch (error) {
        console.log('error: ', error);
      }
      await new Promise((resolve) => setTimeout(resolve, 2197));
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // function findJsonObj (scriptSelector, startString, endString) {
      //   const xpath = `//script[contains(.,'${scriptSelector}')]`;
      //   const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      //   let scriptContent = '';
      //   if (element) {
      //     // @ts-ignore
      //     scriptContent = element != null ? element.innerText : '';
      //   }
      //   let jsonStr = scriptContent;
      //   jsonStr = jsonStr.trim();
      //   jsonStr = jsonStr.replace(/\\n/g, '\\n')
      //     .replace(/\\'/g, "\\'")
      //     .replace(/\\"/g, '\\"')
      //     .replace(/\\&/g, '\\&')
      //     .replace(/\\r/g, '\\r')
      //     .replace(/\\t/g, '\\t')
      //     .replace(/\\b/g, '\\b')
      //     .replace(/\\f/g, '\\f');
      //   // eslint-disable-next-line no-control-regex
      //   jsonStr = jsonStr.replace(/[\u0000-\u0019]+/g, '');
      //   return jsonStr;
      // }
      const url = window.location.href;
      // let brandUrl = document.querySelector('a#bylineInfo');
      // // @ts-ignore
      // brandUrl = brandUrl ? brandUrl.href : '';
      // @ts-ignore
      let currency = document.querySelector('[id="priceblock_ourprice"]');
      // @ts-ignore
      currency = currency !== null ? currency.innerText : '';
      // @ts-ignore
      currency = currency.includes('$') ? '$' : '';
      // @ts-ignore
      let manufacturerDescription = document.querySelector('.aplus-v2.desktop.celwidget');
      // @ts-ignore
      manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : ' ';
      // @ts-ignore
      manufacturerDescription = manufacturerDescription ? manufacturerDescription.replace(/\\"/g, '"') : '';
      // @ts-ignore
      // let firstVariant = findJsonObj('{"pageRefreshUrlParams":{"', '{"pageRefreshUrlParams":', '}}');
      // // @ts-ignore
      // firstVariant = firstVariant ? JSON.parse(firstVariant) : '';
      // // @ts-ignore
      // // eslint-disable-next-line no-unused-vars
      // firstVariant = firstVariant ? firstVariant.pageRefreshUrlParams.parentAsin : '';
      // // @ts-ignore
      // let largeImgCount = document.querySelector('#imageBlock_feature_div > script:nth-child(2)');
      // // @ts-ignore
      // largeImgCount = largeImgCount !== null ? largeImgCount.innerText : '';
      // // @ts-ignore
      // largeImgCount = (largeImgCount.match(/_AC_SL1500_.jpg/g) || []).length;
      // @ts-ignore
      // document.querySelector('div.imgTagWrapper').click();
      // // @ts-ignore
      // // eslint-disable-next-line promise/param-names
      // await new Promise(r => setTimeout(r, 5000));
      // let secondaryImageTotal = document.querySelectorAll('div.ivRow div.ivThumb div.ivThumbImage');
      // // @ts-ignore
      // secondaryImageTotal = secondaryImageTotal.length - 1;
      // console.log('secondaryImageTotal: ', secondaryImageTotal.length - 1);
      // @ts-ignore
      // document.querySelector('#altImages > ul > li.videoThumbnail').click();
      // @ts-ignore
      // eslint-disable-next-line promise/param-names
      // await new Promise(r => setTimeout(r, 90000));
      // let videoLengthArr = [];
      // const videoLength = document.querySelectorAll('#anonCarousel6 > ol > li.a-carousel-card.vse-video-card > div');
      // for (let index = 0; index < videoLength.length; index++) {
      //   console.log('videoLength: ', videoLength.length);
      //   const element = videoLength[index];
      //   console.log('element.duration', element.getAttribute('data-duration'));
      //   videoLengthArr.push(element.getAttribute('data-duration'));
      // }
      // // @ts-ignore
      // videoLengthArr = videoLengthArr.join('|');
      // console.log('videoLengthArr: ', videoLengthArr);
      let lbb = document.querySelector('div[id="merchant-info"] a[id="sellerProfileTriggerId"]');
      // @ts-ignore
      lbb = lbb ? lbb.innerText : '';
      let lbbPrice;
      if (lbb) {
        lbbPrice = document.querySelector('#priceblock_ourprice');
        // @ts-ignore
        lbbPrice = lbbPrice ? lbbPrice.innerText : '';
      } else {
        lbbPrice = '';
      }
      // @ts-ignore
      addElementToDocument('a_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
      addElementToDocument('a_url', url);
      // addElementToDocument('a_videoLength', videoLengthArr);
      addElementToDocument('a_lbbPrice', lbbPrice);
      // addElementToDocument('a_brand_url', brandUrl);
      addElementToDocument('a_online_price_currency', currency);
      addElementToDocument('a_manufacturerDescription', manufacturerDescription);
      // addElementToDocument('a_first_variant', firstVariant);
      // addElementToDocument('a_largeImgCount', largeImgCount);
      // addElementToDocument('a_secondaryImageTotal', secondaryImageTotal);
    });
    return await context.extract(productDetails, { transform: parameters.transform });
  },
};
