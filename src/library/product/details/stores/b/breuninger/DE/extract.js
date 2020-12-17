const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    transform: cleanUp,
    domain: 'breuninger.de',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    // checking if popup exists and if so, closing it
    var acceptButtonPresent = await context.evaluate(async function () {
      if (document.querySelector('button[id="uc-btn-accept-banner"]')) { return document.querySelector('button[id="uc-btn-accept-banner"]'); }
      return null;
    });
    if (acceptButtonPresent) {
      await context.click('button[id="uc-btn-accept-banner"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }
    // manually extracting shippingInfo
    await context.click('div[class*="desktop"]>h2+h2');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    const shippingInfo = await context.evaluate(async function () {
      if (document.querySelector('div[class*="tab-content"]>section')) { return document.querySelector('div[class*="tab-content"]>section').innerText; }
      return null;
    });
    //
    const myUrl = await context.evaluate(async function () {
      if (document.querySelector('meta[property="og:url"]')) { return document.querySelector('meta[property="og:url"]').content; }
    });
    console.log('sdsds myUrl');
    console.log(myUrl);
    let jsonData = await context.evaluate(async function () {
      return JSON.parse(document.querySelector('bewerten-vue-data').getAttribute('data-bewerten-json-content'));
    });

    // manually extracting iframe url and navigating to it
    const gotoIframe = await context.evaluate(async function () {
      if (!(document.querySelector('iframe[id=loadbeeIframeId]'))) {
        await new Promise((resolve, reject) => setTimeout(resolve, 100));
        return null;
      }
      return document.querySelector('iframe[id=loadbeeIframeId]').getAttribute('src');
    });

    let content = null;
    let image = null;
    let comparisionText = null;
    let inBoxUrls = [];
    let inBoxText = [];
    let videos = null;
    if (gotoIframe !== null) await context.goto(gotoIframe);
    await context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll() {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });
    // manually extracting manufacturer description and images
    // const manufacturerDescImg = await context.evaluate(async function () {
    //   const descParts = document.querySelectorAll('div[class="wrapper preview"]>*');
    //   const imagesRaw = document.querySelectorAll('div[class="wrapper preview"] img');
    //   var description = '';
    //   var images = [];
    //   if (descParts && imagesRaw) {
    //     for (let i = 0; i < descParts.length; i++) {
    //       if (descParts[i].innerText === 'Technische Daten') {
    //         break;
    //       }
    //       description += descParts[i].innerText;
    //     }
    //     for (let i = 0; i < imagesRaw.length; i++) {
    //       images.push(imagesRaw[i].src);
    //     }
    //     images = [...new Set(images)];
    //   }
    //   return [description, images];
    // });
    const witbData = await context.evaluate(async () => {
      const getInTheBox = document.querySelector('div.in-the-box img');
      const inBoxUrls = [];
      const inBoxText = [];
      if (getInTheBox) {
        const getAllProducts = document.querySelectorAll('div.in-the-box div:not(.side-pics)');
        for (let i = 0; i < getAllProducts.length; i++) {
          inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute('data-src'));
          inBoxText.push(getAllProducts[i].querySelector('p').innerText);
        }
      }
      return { inBoxText, inBoxUrls };
    });
    inBoxText = witbData.inBoxText;
    inBoxUrls = witbData.inBoxUrls;

    comparisionText = await context.evaluate(async function () {
      return (!!document.querySelector('.compare-headline') && document.querySelector('.compare-headline').offsetHeight > 0 && document.querySelector('.compare-headline').offsetWidth) > 0;
    });

    content = await context.evaluate(async function () {
      return document.querySelector('body').innerText;
    });

    image = await context.evaluate(async function () {
      if (document.querySelectorAll('div.wrapper img[data-src]')) {
        const images = document.querySelectorAll('div.wrapper img[data-src]');
        const imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('data-src'));
        });
        return imagesSrc;
      }
    });
    // manually extracting videos
    videos = await context.evaluate(async function () {
      var videosSrc = [];
      if (document.querySelectorAll('div[data-video]')) {
        const rawVideos = document.querySelectorAll('div[data-video]');
        for (let i = 0; i < rawVideos.length; i++) {
          videosSrc.push(rawVideos[i].getAttribute('data-video'));
        }
      }
      return videosSrc;
    });

    // manually extracting iframe data (specifications, weightNet)
    const iframeData = await context.evaluate(async function () {
      var specifications = '';
      var weightNet = '';
      if (document.querySelectorAll('div[class*="info"]>div[class*="info"]')) {
        const rawSpecifications = document.querySelectorAll('div[class*="info"]>div[class*="info"]');
        for (let i = 0; i < rawSpecifications.length; i++) {
          if (rawSpecifications[i].querySelector('h5')) {
            if (rawSpecifications[i].querySelector('h5').innerText === 'Gewicht') {
              weightNet = rawSpecifications[i].querySelector('p').innerText;
            }
            specifications += ` || ${rawSpecifications[i].innerText}`;
          }
        }
      }
      return { specifications: specifications, weightNet: weightNet };
    });
    await context.goto(myUrl);
    await context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    // checking if popup exists and if so, closing it
    acceptButtonPresent = await context.evaluate(async function () {
      return document.querySelector('button[id="uc-btn-accept-banner"]');
    });
    if (acceptButtonPresent) {
      await context.click('button[id="uc-btn-accept-banner"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }
    // checking if down arrow for photos exist and if so, pressing it
    const arrowDownPresent = await context.evaluate(async function () {
      if (document.querySelector('div[class*="bewerten-slider"]>svg[class*="arrows--down"]')) { return document.querySelector('div[class*="bewerten-slider"]>svg[class*="arrows--down"]'); }
      return null;
    });
    if (arrowDownPresent) {
      await context.click('div[class*="bewerten-slider"]>svg[class*="arrows--down"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }
    // extracting data automatically
    // await context.extract(productDetails, { transform });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    async function addHiddenInfo(elementID, content, contentArr = []) {
      await context.evaluate(async function (elementID, content, contentArr) {
        if (contentArr.length == 0)
          contentArr.push(content);
        contentArr.forEach((element) => {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = element;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        });
      }, elementID, content, contentArr);
    }
    addHiddenInfo('ii_inBoxUrls', "", inBoxUrls);

    addHiddenInfo('ii_comparisionText', comparisionText ? 'Yes' : 'No');
    console.log('inBoxText');
    console.log(inBoxText);
    addHiddenInfo('ii_inBoxText', "", inBoxText);

    addHiddenInfo('ii_manufContent', content);
    if (image && image.length) {
      addHiddenInfo('ii_manufContentImg', image.join(' || '));
    }

    addHiddenInfo('ii_specifications', iframeData.specifications || '');

    addHiddenInfo('ii_weightNet', iframeData.weightNet || '');

    if (videos && videos.length) {
      videos = [...new Set(videos)];
      videos.forEach((element) => {
        addHiddenInfo('ii_videos', element);
      });
    }

    // manually extracting description
    const description = await context.evaluate(async function () {
      const descParts = document.querySelectorAll('header+div[class*="bewerten-produkt-detail"]>div[class="bewerten-textformat"]>*');
      var description = '';
      for (let i = 0; i < descParts.length; i++) {
        var bulletPoints = descParts[i].querySelectorAll('li');
        if (bulletPoints.length) {
          for (let j = 0; j < bulletPoints.length; j++) {
            description += ' || ';
            description += bulletPoints[j].innerText;
          }
        } else {
          description += descParts[i].innerText;
        }
      }
      return description;
    });

    addHiddenInfo('ii_description', description);
    // manually extracting additional description bullet info
    const additionalDescBulletInfo = await context.evaluate(async function () {
      const bulletInfoParts = document.querySelectorAll('div>div[class="bewerten-textformat"]>ul>li');
      var additionalDescBulletInfo = '';
      for (let i = 0; i < bulletInfoParts.length; i++) {
        additionalDescBulletInfo += `|| ${bulletInfoParts[i].innerText} `;
      }
      return additionalDescBulletInfo;
    });

    addHiddenInfo('ii_additionalDescBulletInfo', additionalDescBulletInfo);

    addHiddenInfo('ii_shippingInfo', shippingInfo);
    // manually extracting json stored data
    if (!jsonData) {
      jsonData = await context.evaluate(async function () {
        return JSON.parse(document.querySelector('bewerten-vue-data').getAttribute('data-bewerten-json-content'));
      });
    }

    console.log('212121jsonData');

    console.log(jsonData);

    if (jsonData) {
      addHiddenInfo('ii_sku', jsonData.artikelKey || '');
      addHiddenInfo('ii_mainImage', jsonData.artikel && jsonData.artikel[jsonData.artikelKey] && jsonData.artikel[jsonData.artikelKey].ansichten && jsonData.artikel[jsonData.artikelKey].ansichten.length ? jsonData.artikel[jsonData.artikelKey].ansichten[0].zoomUrl : '');
    }

    var dataRef = await context.data();

    console.log('212121dataRef');
    console.log(dataRef);
    // if (dataRef[0].data[0].group[0].alternateImages.length + 1 === jsonData.artikel[jsonData.artikelKey].ansichten.length) {

    //     if (!('image' in dataRef[0].data[0].group[0])) {
    //         dataRef[0].data[0].group[0].image = [];
    //         dataRef[0].data[0].group[0].image.push({ text: ' ' });
    //     } else {
    //         delete dataRef[0].data[0].group[0].image[0].xpath;
    //     }
    //     dataRef[0].data[0].group[0].image[0].text = jsonData.artikel[jsonData.artikelKey].ansichten[0].zoomUrl;
    // }
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    return await context.extract(productDetails, { transform });
    // const inboxdata = await context.evaluate(async function() {
    //     let imagesUrl = inTheBoxImages.join(' || ')
    //     let imagesText = inTheBoxTexts.join(' || ')
    //     document.head.setAttribute('intheboxurl', imagesUrl);
    //     document.head.setAttribute('intheboxtext', imagesText);
    // });
    // inboxdata;
  },
};
