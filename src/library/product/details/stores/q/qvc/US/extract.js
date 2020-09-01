const { transform } = require('./shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variants = await context.evaluate(async () => {
    console.log('Length of all', document.querySelectorAll("ul[class*='buyBoxColorList'] li").length);
    return (document.querySelectorAll("ul[class*='buyBoxColorList'] li")) ? document.querySelectorAll("ul[class*='buyBoxColorList'] li").length : 0;
  });
  console.log('Length', variants);
  async function preparePage (index, variants) {
    await context.evaluate(async (index) => {
      async function scrollToFooter () {
        var element = (document.querySelector("div[class*='footerTop']")) ? document.querySelector("div[class*='footerTop']") : null;
        if (element) {
          // alert('inside');
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }
      await scrollToFooter();
      const variants = document.querySelectorAll("ul[class*='buyBoxColorList'] li") ? document.querySelectorAll("ul[class*='buyBoxColorList'] li") : [];
      // @ts-ignore
      let productJSON = document.querySelector("script[id='productJSON']") ? JSON.parse(document.querySelector("script[id='productJSON']").innerText) : null;
      productJSON = (productJSON.atsByColor) ? (productJSON.atsByColor) : [];
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function videoAPI () {
        var element = (document.querySelectorAll("div[class='videoThumbnails'] > div[class*='video']")) ? document.querySelectorAll("div[class='videoThumbnails'] > div[class*='video']") : null;
        const link = [];
        const promiseLink = [];
        for (let i = 0; i < element.length; i++) {
          const id = element[i].getAttribute('data-video-id').trim();
          const url = 'https://d2q1b32gh59m9o.cloudfront.net/player/config?callback=qvcuk33914189&client=qvcuk&type=vod&apiKey=7Bg5Js6Qy2Pi6Hx6Vd6Ey9Ai4Si2Hw&videoId=' + id + '&format=jsonp&callback=qvcuk33914189';
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
          if (!document.querySelector(`div[id="ii_video_${i}"]`)) {
            addHiddenDiv('ii_video_' + i, link[i]);
          }
        }
      }
      function addSKU (index) {
        // @ts-ignore
        let skuNumber = document.querySelector('script[type="application/ld+json"]') ? document.querySelector('script[type="application/ld+json"]').innerText : '';
        if (skuNumber) {
          // @ts-ignore
          skuNumber = (JSON.parse(skuNumber.replace(/\\"/gm, '"'))) ? JSON.parse(skuNumber.replace(/\\"/gm, '"')) : [];
          // @ts-ignore
          // eslint-disable-next-line eqeqeq
          index == 0 && variants.length > 0 && skuNumber.offers && skuNumber.offers.forEach((item) => {
            item.sku && addHiddenDiv('ii_variants', item.sku);
          });
          // @ts-ignore
          skuNumber = (skuNumber.offers && skuNumber.offers[index]) ? skuNumber.offers[index].sku : '';
          skuNumber && addHiddenDiv('ii_sku', skuNumber);
          console.log('SKU :: ', skuNumber);
        }
      }
      function addFields (index) {
        const id = variants && variants[index] && variants[index].getAttribute('data-id') && productJSON[variants[index].getAttribute('data-id')] ? productJSON[variants[index].getAttribute('data-id')] : '';
        console.log('Inside variants', id);
        if (id && id.image) {
          addHiddenDiv('ii_image', id.image);
        } else {
          const image = document.querySelector("div[class*='easyzoom--with-thumbnails'] img") ? document.querySelector("div[class*='easyzoom--with-thumbnails'] img").getAttribute('src') : '';
          addHiddenDiv('ii_image', image);
        };
        if (id && id.ats === 'Y') {
          addHiddenDiv('ii_available', 'In Stock');
        } else if (id && id.ats === 'N') {
          addHiddenDiv('ii_available', 'Out of Stock');
        } else if (id && id.ats === 'W') {
          addHiddenDiv('ii_available', 'Available on Waitlist');
        } else {
          // @ts-ignore
          const avail = (document.querySelector("div[class*='buyBoxAvailibility'] p[style*='block']")) ? document.querySelector("div[class*='buyBoxAvailibility'] p[style*='block']").innerText : '';
          addHiddenDiv('ii_available', avail);
        }
        if (id && id.currentPrice) {
          addHiddenDiv('ii_price', id.currentPrice);
        } else if (id && id.qvcPrice) {
          addHiddenDiv('ii_price', id.qvcPrice);
        } else {
          // @ts-ignore
          const price = (document.querySelector("span[class*='productDetailPrice'] , span[class='price priceSm'] , span[class='price']")) ? document.querySelector("span[class*='productDetailPrice'] , span[class='price priceSm'] , span[class='price']").innerText : '';
          addHiddenDiv('ii_price', price);
        };
        if (variants) {
          variants[index] && variants[index].getAttribute('data-original-title') && addHiddenDiv('ii_color', variants[index].getAttribute('data-original-title'));
          variants[index] && variants[index].getAttribute('data-id') && addHiddenDiv('ii_colorCode', variants[index].getAttribute('data-id'));
        }
      }
      await addSKU(index);
      await addFields(index);
      // await videoAPI();
    }, index, variants);
  }
  for (let index = 0; index < variants - 1; index++) {
    await preparePage(index);
    await context.extract(productDetails, { transform }, { type: 'APPEND' });
  }
  variants <= 1 && await preparePage(0);
  variants > 1 && await preparePage(variants - 1);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    transform,
    domain: 'qvc.com',
    zipcode: '',
  },
  implementation,
};
