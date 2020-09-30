const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'rakuten',
    transform: null,
    domain: 'rakuten.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector('div.vw-productMain');
    await new Promise((resolve, reject) => setTimeout(resolve, 100));
    // closing cookie consent popup, if present
    // ====================================================================================
    const cookieConsent = await context.evaluate(async function () {
      return document.querySelector('div.privacy_prompt.explicit_consent');
    });
    if (cookieConsent) {
      context.click('div.button.left');
    }
    // automatic data extraction
    // ====================================================================================
    await context.extract(productDetails);
    // manualy extracting category
    // ====================================================================================
    const category = await context.evaluate(async function () {
      const rawCategory = document.querySelectorAll('span[property="name"]');
      let category = '';
      for (let i = 1; i < rawCategory.length; i++) {
        category += rawCategory[i].innerText;
        if (i + 1 != rawCategory.length) {
          category += ' > ';
        };
      }
      return category
    });
    // checking for iframe exists, and if so redirecting to it
    // ====================================================================================
    const iframeUrl = await context.evaluate(async function () {
      let iframeUrl = document.querySelector('iframe[id="loadbeeIframeId"]');
      if (iframeUrl){
        return iframeUrl.getAttribute('src');
      }
      return null;
    });
    if (iframeUrl) {
      context.goto(iframeUrl);
      context.waitForNavigation();
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
    // manually extracting iframe data
    // ====================================================================================
    const iframeData = await context.evaluate(async function () {
      var iframeData = {};
      // manually extracting videos
      // ====================================================================================
      iframeData.videos = [];
      const rawVideos = document.querySelectorAll('*[data-video]');
      for (let i = 0; i < rawVideos.length; i++) {
        iframeData.videos.push(rawVideos[i].getAttribute('data-video'));
      }
      // manually extracting manufacturer description and images
      // ====================================================================================
      const chapterTitles = document.querySelectorAll('*[class="next-chapter"]');
      const rawChapters = document.querySelectorAll('*[class="next-chapter"]+div');
      iframeData.manufacturerDescription = '';
      iframeData.manufacturerImages = [];
      for (let i = 0; i < chapterTitles.length; i++) {
        if (chapterTitles[i].innerText === 'Technische Daten') {
          break;
        }
        var descParts = rawChapters[i].querySelectorAll('div[class="pic-text"]>div');
        for (let j = 0; j < descParts.length; j++) {
          iframeData.manufacturerDescription += descParts[j].innerText;
        }
        var rawImages = rawChapters[i].querySelectorAll('img');
        for (let j = 0; j < rawImages.length; j++) {
          iframeData.manufacturerImages.push(rawImages[j].getAttribute('src'));
        }
      }
      // manually extracting technical data
      // ====================================================================================
      iframeData.specifications = '';
      const rawTitles = document.querySelectorAll('div[class*="info"]>h5');
      const rawValues = document.querySelectorAll('div[class*="info"]>h5+p');
      if (rawTitles.length === rawValues.length) {
        for (let i = 0; i < rawTitles.length; i++){
          if (rawTitles[i].innerText === 'Gewicht') {
            iframeData.weightNet = rawValues[i].innerText;
          }
          if (rawValues[i].innerText.includes('m') || rawValues[i].innerText.includes('cm') || rawValues[i].innerText.includes('mm')) {
            iframeData.specifications += `${rawTitles[i].innerText} ${rawValues[i].innerText}\n`;
          }
        }
      } else {
        return null;
      }
      return iframeData;
    });
    // creating output data reference
    // ====================================================================================
    var dataRef = await context.data();
    // inserting manualy extrcted data
    // ====================================================================================
    dataRef[0].data[0].group[0].category = [{ text: category }];
    if ('weightNet' in iframeData) {
      dataRef[0].data[0].group[0].weightNet = [{ text: iframeData.weightNet }];
    }
    if (iframeData.manufacturerDescription != '') {
      dataRef[0].data[0].group[0].manufacturerDescription = [{ text: iframeData.manufacturerDescription }];
    }
    if (iframeData.manufacturerImages.length > 0) {
      iframeData.manufacturerImages = [...new Set(iframeData.manufacturerImages)];
      dataRef[0].data[0].group[0].manufacturerImages = [];
      for (let i = 0; i < iframeData.manufacturerImages.length; i++) {
        dataRef[0].data[0].group[0].manufacturerImages.push({ text: iframeData.manufacturerImages[i] });
      }
    }
    if (iframeData.videos.length > 0) {
      if (!('videos' in dataRef[0].data[0].group[0])) {
        dataRef[0].data[0].group[0].videos = [];
      }
      for (let i = 0; i < iframeData.videos.length; i++) {
        dataRef[0].data[0].group[0].videos.push({ text: iframeData.videos[i] });
      }
    }
    if (iframeData.specifications != '') {
      dataRef[0].data[0].group[0].specifications = [{ text: iframeData.specifications }];
    }
  },
};
