
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'elkjop',
    transform: cleanUp,
    domain: 'elgiganten.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
    });
    await context.waitForSelector('a#tab-specs-trigger', { timeout: 10000 });
    await context.click('a#tab-specs-trigger');
    await context.waitForSelector('a#tab-more-info-trigger', { timeout: 10000 });
    await context.click('a#tab-more-info-trigger');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const rating = document.evaluate("//div[@itemprop='aggregateRating']/meta[@itemprop='ratingValue']/@content", document, null, XPathResult.STRING_TYPE, null);
      if (rating && rating.stringValue) {
        const formattedRating = rating.stringValue.replace(',', '.');
        addElementToDocument('rating', formattedRating);
      }
      const weight = document.evaluate("//*[contains(text(), 'Vægt')]", document, null, XPathResult.STRING_TYPE, null);
      if (weight && weight.stringValue) {
        const formattedWeight = weight.stringValue.replace(/\n|Vægt|\(|\)\s/g, '');
        addElementToDocument('weight', formattedWeight);
      }
    });
    await context.evaluate(async function getDataFromAPI (id) {
      function addHiddenDiv (vidurl, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('data-vidurl', vidurl);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const sku = document.evaluate("//meta[@itemprop='sku']/@content", document, null, XPathResult.STRING_TYPE, null);
      const name = document.evaluate("//meta[@itemprop='name']/@content", document, null, XPathResult.STRING_TYPE, null);
      const embeedVideos = document.querySelectorAll('video.el-videoplayer');
      if (embeedVideos) {
        for (var i = 0; i < embeedVideos.length; i++) {
          // @ts-ignore
          var urlEmbeedVideo = embeedVideos[i].src;
          addHiddenDiv('vidURL', urlEmbeedVideo);
        }
      }
      if (sku && name) {
        var skuS = sku.stringValue;
        var nameS = name.stringValue;
        const vidApiUrl = `https://dapi.videoly.co/1/videos/0/5/?SKU=${skuS}&productTitle=${nameS}&hn=www.gigantti.fi`;
        const videoApi = await fetch(vidApiUrl,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            method: 'GET',
          },
        ).then(x => x.json());

        const video = videoApi.items;
        let videoUrl;
        video.forEach(vid => {
          videoUrl = `https://www.youtube.com/watch?v=${vid.videoId}&feature=youtu.be`;
          addHiddenDiv('vidURL', videoUrl);
        });
      }
    });
    await context.extract(productDetails);
  },
};
