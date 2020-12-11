const { transform } = require('../format.js');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const onSearchPage = await context.evaluate(() => {
    return !!document.querySelector('.product_name_link');
  });
  if (onSearchPage) {
    await context.clickAndWaitForNavigation('.product_name_link', { timeout: 15000 }, { waitUntil: 'load' });
  }

  async function getVideoLinks () {
    const iframe = document.querySelector('div.videoContainer iframe');
    if (!iframe) return;
    const response = await fetch(document.querySelector('div.videoContainer iframe').src);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const videoElements = Array.from(doc.querySelectorAll('[id^=isitetv_nav_item_nav_ul] > li > a'));
    const videoLinks = videoElements.map(elm => elm.getAttribute('onclick').match(/log_action\(\d+,\d+,\d+,\d+,\d+,(\d+)/)[1])
      .map(elm => `http://flv.isitetv.com/media/video/1499/video_url_${elm}_1499.m4v`).join('|');
    document.body.setAttribute('video-links', videoLinks);
    return videoLinks;
  }
  await context.evaluate(getVideoLinks);
  await context.evaluate(() => {
    if (!document.querySelector('li[id^="size_combo_button_pdp"][onclick]')) {
      document.body.classList.add('no-variants');
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation,
};
