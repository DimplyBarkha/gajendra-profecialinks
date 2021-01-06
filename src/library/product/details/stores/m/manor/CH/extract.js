const { cleanUp } = require('./shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform: cleanUp,
    domain: 'manor.ch',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    // Single Pipe Concatenation
    const pipeSeparatorSingle = (id, data) => {
      var singleSeparatorText = data.join(' | ');
      addElementToDocument(id, singleSeparatorText);
    };
    // space Pipe Concatenation
    const spaceSeparatorSingle = (id, data) => {
      var singleSeparatorText = data.join(' ');
      addElementToDocument(id, singleSeparatorText);
    };
    // Method to Retrieve Xpath content of a Multiple Nodes
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

    // @ts-ignore
    const nameEmpty = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"] h1')[0].innerText;
    addElementToDocument('nameEmpty', nameEmpty);

    // @ts-ignore
    const scriptData = window.dataLayer[0];
    addElementToDocument('gtin', scriptData.transactionProducts[0].ean);
    const variants = getAllXpath('//div[@class="m-productcolorselect-v-2__colors js-only-colors"]/div/a/@title', 'nodeValue');
    pipeSeparatorSingle('variants', variants);
    try {
      const desc = getAllXpath('//div[@class="m-productdescription__description js-desc"]//text()', 'nodeValue');
      spaceSeparatorSingle('desc', desc);
    } catch (error) {

    }
    const finalName = [];
    try {
      // @ts-ignore
      const name = document.querySelectorAll('div[class="m-productdetailareaa__areaA__title-line g-col g-col-1"]')[0].innerText;
      if (name !== null && name.length > 0) {
        finalName.push(name);
      }
    } catch (error) {

    }
    // try {
    //   // @ts-ignore
    //   let size = document.querySelector('span[class="m-productsizeselect-v-2__title"]').outerText.replace(/INHALT: /g, '')
    //   if (size !== null && size.length > 0 && !size.includes('INHALT')) {
    //     finalName.push(size);
    //     addElementToDocument('size', size);
    //   }
    //   else {
    //     // @ts-ignore
    //     size = document.querySelector('a[class="m-productsizeselect-v-2__variant m-productsizeselect-v-2__variant__title js-size-selector-title"]').outerText
    //     if (size !== null && size.length > 0) {
    //       finalName.push(size);
    //       addElementToDocument('size', size);
    //     }
    //   }
    // } catch (error) {
    // }
    // try {
    //   // @ts-ignore
    //   const color = document.querySelector('span[class="m-productcolorselect-v-2__selector-title').outerText.replace(/FARBE: /g, '')
    //   if (color !== null && color.length > 0 && !color.includes('FARBE')) {
    //     finalName.push(color);
    //   }
    // } catch (error) {
    // }
    //code for getting the videos
    const apiData = await fetch("https://edge.api.brightcove.com/playback/v1/accounts/4358179163001/videos/6154651500001", {
      "headers": {
        "accept": "application/json;pk=BCpkADawqM1Emn-upEqSOSGmefJhZeS_QE6heAREPKh1LSd6zhlO-LZ9NU1cQw40wO4v9U6o5JsLL4cDay2fgvbxi2wcIo4elibH9zUJeCgx_42lUlARg_v6WYl5A8Wm5CAxAlIi37MaYuEZ",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
      },
      "referrer": "https://www.manor.ch/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    });
    const jsonData = apiData && await apiData.json();
    const assetId = jsonData && jsonData.sources && jsonData.sources.find((element) => {
      if (element.container == 'MP4') {
        return element.asset_id;
      }
    })
    const assetID = assetId && assetId.asset_id;
    const videoId = document.evaluate('//div[@id="videoPlayer"]/@data-video-id', document).iterateNext() && document.evaluate('//div[@id="videoPlayer"]/@data-video-id', document).iterateNext().textContent;
    const accountId = document.evaluate('//div[@id="videoPlayer"]/@data-account', document).iterateNext() && document.evaluate('//div[@id="videoPlayer"]/@data-account', document).iterateNext().textContent;
    const videoUrl = `http://f1.media.brightcove.com/4/${accountId}/${accountId}_${assetID}_${videoId}.mp4`
    if (videoId !== null && accountId !== null && accountId !== null) {
      addElementToDocument('videolink', videoUrl)
    }



    const url = window.location.href;
    const sku = url && url.replace(/(.+)(\/p\/)(.+)/g, '$3')
    addElementToDocument('skuvalue', sku)
    spaceSeparatorSingle('name', finalName);
    let alternateImages = [];
    let temp;
    try {
      const alImages = document.querySelectorAll('div[class="m-productgallery__thumbnails__single__bg"]');
      for (let i = 0; i < alImages.length; i++) {
        // @ts-ignore
        temp = alImages[i].style.backgroundImage;
        if (temp !== null && temp.length > 0) {
          temp = temp.replace(/url\("/g, '');
          temp = temp.replace('")', '');
          alternateImages.push(temp);
        }
      }
    } catch (error) {

    }
    addElementToDocument('Images', alternateImages[0]);
    for (let k = 1; k < alternateImages.length; k++) {
      addElementToDocument('alternateImages', alternateImages[k]);
    }
    addElementToDocument('totalalternateimages', alternateImages.length - 1);
  });
  return await context.extract(productDetails, { transform });
}


