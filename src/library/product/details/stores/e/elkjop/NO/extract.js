
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    transform: cleanUp,
    domain: 'elkjop.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
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
      function addElementToDocumentClass (key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const warranty = document.evaluate("//*[contains(text(), ' garanti')]", document, null, XPathResult.STRING_TYPE, null);
      if (warranty) {
        if (warranty.stringValue.length === 0) {
          var cleanWarranty = document.evaluate("//div[@class='tab-slot']/p/text()[position() = last()]", document, null, XPathResult.STRING_TYPE, null).stringValue;
          if (cleanWarranty.includes('garanti')) {
            addElementToDocument('warranty', cleanWarranty);
          }
        } else {
          addElementToDocument('warranty', warranty.stringValue);
        }
      }
      const nodeListH = document.querySelectorAll('.article-text.article-free-html h2');
      const nodeListP = document.querySelectorAll('.article-text.article-free-html p');
      var allEnhancedContent = '';
      if (nodeListH && nodeListP && nodeListH.length > 0 && nodeListP.length > 0) {
        for (var k = 0; k < nodeListH.length; k++) {
          // @ts-ignore
          allEnhancedContent = allEnhancedContent + ' ' + nodeListH[k].innerText;
          // @ts-ignore
          allEnhancedContent = allEnhancedContent + ' ' + nodeListP[k].innerText;
        }
        addElementToDocument('enhCont', allEnhancedContent);
      }
      const bulletInfo = document.querySelectorAll('div.row.misc-info ul.specs li');
      if (bulletInfo) {
        var bulletInfoText = '';
        for (var n = 0; n < bulletInfo.length; n++) {
          // @ts-ignore
          bulletInfoText = bulletInfoText + '||' + bulletInfo[n].innerText;
          addElementToDocument('bulletInfoText', bulletInfoText);
        }
      }
      const category = document.querySelectorAll('ol.breadcrumbs.S-1-1 li a');
      if (category) {
        var categoryText = '';
        for (var q = 0; q < category.length - 1; q++) {
          // @ts-ignore
          categoryText = category[q].title;
          addElementToDocumentClass('category', categoryText);
        }
      }
      const rating = document.evaluate("//div[@itemprop='aggregateRating']/meta[@itemprop='ratingValue']/@content", document, null, XPathResult.STRING_TYPE, null);
      if (rating && rating.stringValue) {
        // const formattedRating = rating.stringValue.replace(',', '.');
        addElementToDocument('rating', rating.stringValue);
      }
      const weight = document.evaluate("//div[contains(text(), 'Vekt')]", document, null, XPathResult.STRING_TYPE, null);
      if (weight && weight.stringValue) {
        const formattedWeight = weight.stringValue.replace(/\n|Vekt|\(|\)\s/g, '');
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
      if (sku && name) {
        const embeedVideos = document.querySelectorAll('video.el-videoplayer');
        if (embeedVideos) {
          for (var i = 0; i < embeedVideos.length; i++) {
            // @ts-ignore
            var urlEmbeedVideo = embeedVideos[i].src;
            addHiddenDiv('vidURL', urlEmbeedVideo);
          }
        }
        var skuS = sku.stringValue;
        var nameS = name.stringValue;
        if (skuS && nameS) {
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
      }
    });
    await context.extract(productDetails, { transform });
  },
};
