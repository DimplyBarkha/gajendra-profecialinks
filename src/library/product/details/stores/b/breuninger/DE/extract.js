
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    transform: null,
    domain: 'breuninger.de',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    const acceptButtonPresent = await context.evaluate(async function () {
      return document.querySelector('button[id="uc-btn-accept-banner"]');
    });
    if (acceptButtonPresent) {
      await context.click('button[id="uc-btn-accept-banner"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }
    //
    const arrowDownPresent = await context.evaluate(async function () {
      return document.querySelector('div[class*="bewerten-slider"]>svg[class*="arrows--down"]');
    });
    if (arrowDownPresent) {
      await context.click('div[class*="bewerten-slider"]>svg[class*="arrows--down"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }
    //
    await context.extract(productDetails);
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    //
    const description = await context.evaluate(async function () {
      const descParts = document.querySelectorAll('div>div[class="bewerten-textformat"]>p');
      var description = '';
      for (let i = 0; i < descParts.length; i++) {
        description += descParts[i].innerText;
      }
      return description;
    });
    //
    const directions = await context.evaluate(async function () {
      const rawDirections = document.querySelectorAll('section[class*="akkordeon"] p');
      var directions = '';
      for (let i = 0; i < rawDirections.length; i++) {
        directions += rawDirections[i].innerText;
      }
      return directions;
    });
    //
    const shippingInfo = await context.evaluate(async function () {
      document.querySelector('div[class*="desktop"]>h2+h2').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
      return document.querySelector('div[class*="tab-content"]>section').innerText;
    });
    //
    const jsonData = await context.evaluate(async function () {
      return JSON.parse(document.querySelector('bewerten-vue-data').getAttribute('data-bewerten-json-content'));
    });
    //
    const gotoIframe = await context.evaluate(async function () {
      return document.querySelector('iframe[id=loadbeeIframeId]').src;
    });
    await context.goto(gotoIframe);
    await context.waitForNavigation();
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    //
    const manufacturerDescImg = await context.evaluate(async function () {
      const descParts = document.querySelectorAll('div[class="wrapper preview"]>*');
      const imagesRaw = document.querySelectorAll('div[class="wrapper preview"] img');
      var description = '';
      var images = [];
      for (let i = 0; i < descParts.length; i++) {
        if (descParts[i].innerText === 'Technische Daten') {
          break;
        }
        description += descParts[i].innerText;
      }
      for (let i = 0; i < imagesRaw.length; i++) {
        images.push(imagesRaw[i].src);
      }
      images = [...new Set(images)];
      return [description, images];
    });
    //
    const videos = await context.evaluate(async function () {
      var videos = [];
      const rawVideos = document.querySelectorAll('div[data-video]');
      for (let i = 0; i < rawVideos.length; i++) {
        videos.push(rawVideos[i].getAttribute('data-video'));
      }
      videos = [...new Set(videos)];
      return videos;
    });
    //
    const specifications = await context.evaluate(async function () {
      var specifications = '';
      const rawSpecifications = document.querySelectorAll('div[class*="info"]>div[class*="info"]');
      for (let i = 0; i < rawSpecifications.length; i++) {
        specifications += rawSpecifications[i].innerText;
      }
      return specifications;
    });
    //
    var dataRef = await context.data();
    dataRef[0].data[0].group[0].directions[0].text += '\n';
    dataRef[0].data[0].group[0].directions[0].text += directions;
    dataRef[0].data[0].group[0].specifications[0].text = specifications;
    dataRef[0].data[0].group[0].manufacturerDescription[0].text = manufacturerDescImg[0];
    dataRef[0].data[0].group[0].manufacturerImages = [];
    for (let i = 0; i < manufacturerDescImg[1].length; i++) {
      dataRef[0].data[0].group[0].manufacturerImages.push({ text: manufacturerDescImg[1][i] });
    }
    if (!('videos' in dataRef[0].data[0].group[0])) {
      dataRef[0].data[0].group[0].videos = [];
    }
    for (let i = 0; i < videos.length; i++) {
      dataRef[0].data[0].group[0].videos.push({ text: videos[i] });
    }
    dataRef[0].data[0].group[0].description[0].text = description;
    dataRef[0].data[0].group[0].shippingInfo[0].text = shippingInfo;
    dataRef[0].data[0].group[0].sku[0].text = jsonData.artikelKey;
    if (dataRef[0].data[0].group[0].alternateImages.length + 1 === jsonData.artikel[jsonData.artikelKey].ansichten.length) {
      for (let i = 0; i < dataRef[0].data[0].group[0].alternateImages.length; i++) {
        dataRef[0].data[0].group[0].alternateImages[i].text = jsonData.artikel[jsonData.artikelKey].ansichten[i + 1].zoomUrl;
        delete dataRef[0].data[0].group[0].alternateImages[i].xpath;
      }
      dataRef[0].data[0].group[0].image[0].text = jsonData.artikel[jsonData.artikelKey].ansichten[0].zoomUrl;
      delete dataRef[0].data[0].group[0].image[0].xpath;
    }
  },
};
