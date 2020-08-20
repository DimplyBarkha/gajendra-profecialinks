const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll("ul[aria-label='Auswahl'] li:not([state='disabled'])")) ? document.querySelectorAll("ul[aria-label='Auswahl'] li:not([state='disabled'])").length : 0;
  });
  console.log('Length', variantLength);
  async function preparePage (index) {
    await context.evaluate(async (index) => {
      console.log('index of variant', index);
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      var element = (document.querySelectorAll("div[class='videoThumbnails'] > div[class*='video']")) ? document.querySelectorAll("div[class='videoThumbnails'] > div[class*='video']") : null;
      const link = [];
      const promiseLink = [];
      for (let i = 0; i < element.length; i++) {
        const id = element[i].getAttribute('data-video-id').trim();
        const url = 'https://d2q1b32gh59m9o.cloudfront.net/player/config?callback=qvcde37083458&client=qvcde&type=vod&apiKey=3Zq6Qf7Nl4Xz2Ve0Zv8Ns7El8Fp1Qi&videoId=' + id + '&format=jsonp&callback=qvcde37083458';
        const value = fetch(url).then(response => {
          return response.text();
        });
        promiseLink.push(value);
      }
      await Promise.all(promiseLink).then((value) => {
        value.forEach((value) => {
          value.match(/"mp4":"(.*?)"/) && value.match(/"mp4":"(.*?)"/)[1] && link.push(value.match(/"mp4":"(.*?)"/)[1].replace(/\\/gm, ''));
        });
      });
      console.log('links', link, link.length);
      for (let i = 0; i < link.length; i++) {
        addHiddenDiv('ii_video', link[i]);
      }
      // @ts-ignore
      let skuNumber = document.querySelector('script[type="application/ld+json"]') ? document.querySelector('script[type="application/ld+json"]').innerText : '';
      if (skuNumber) {
        skuNumber = (JSON.parse(skuNumber.replace(/\\"/gm, '"'))) ? JSON.parse(skuNumber.replace(/\\"/gm, '"')) : [];
        index === 0 && skuNumber.offers && skuNumber.offers.forEach((item) => {
          item.sku && item.availability.includes('InStock') && addHiddenDiv('ii_variants', item.sku);
        });
        skuNumber = (skuNumber.offers && skuNumber.offers[index]) ? skuNumber.offers[index].sku : '';
        skuNumber && addHiddenDiv('ii_sku', skuNumber);
      }
    }, index);
  }
  async function scrollToImg () {
    await context.evaluate(async () => {
      var element = (document.querySelector("div[data-component-type='LARGE_STATIC_IMAGE'] img[class*='largeDisplayImage']")) ? document.querySelector("div[data-component-type='LARGE_STATIC_IMAGE'] img[class*='largeDisplayImage']") : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    });
  }
  if (variantLength > 1) {
    for (let index = 0; index < variantLength; index++) {
      await context.click(`ul[aria-label='Auswahl'] li:not([state='disabled']):nth-child(${index + 1})`);
      // await new Promise((resolve) => { setTimeout(resolve, 10000); });
      if (index <= variantLength - 2) {
        console.log('Inside variants', index);
        await scrollToImg();
        await preparePage(index);
        // console.log("Variant1", context.evaluate(() => { return document.querySelector("div[class*='easyzoom--with-thumbnails'] img").getAttribute("src")}));
        await context.extract(productDetails, { transform }, { type: 'APPEND' });
        // await new Promise((resolve) => { setTimeout(resolve, 10000); });
      }
    }
  }
  await scrollToImg();
  if (variantLength) {
    await preparePage(variantLength - 1);
  } else {
    await preparePage(0);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'qvc',
    transform,
    domain: 'qvc.de',
    zipcode: '',
  },
  implementation,
};
