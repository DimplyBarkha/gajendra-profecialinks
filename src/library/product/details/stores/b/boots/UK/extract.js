const { transform } = require('../format.js');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  /* '
  *  @INFO Don't go to search page. Use sku as input id with the template https://www.boots.com/ProductDisplay?productId={id}.

  const onSearchPage = await context.evaluate(() => {
    return !!document.querySelector('.product_name_link');
  });
  if (onSearchPage) {
    await context.clickAndWaitForNavigation('.product_name_link', { timeout: 15000 }, { waitUntil: 'load' });
  }*/

  async function getVideoLinks () {
    const selector = 'div.videoContainer iframe,.isitetv-video-container iframe';
    const iframe = document.querySelector(selector);
    if (!iframe) return;
    if (document.querySelector(selector).src.includes('www.youtube')) {
      document.body.setAttribute('video-links', document.querySelector(selector).src);
      return;
    }
    const response = await fetch(document.querySelector(selector).src);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const videoElements = Array.from(doc.querySelectorAll('[id^=isitetv_nav_item_nav_ul] > li > a'));
    const videoLinks = videoElements.map(elm => ({ videoId: elm.getAttribute('onclick').match(/log_action\(\d+,\d+,\d+,\d+,\d+,(\d+)/)[1], folderId: elm.querySelector('img').src.match(/media\/video\/([^\/]+)/)[1]}))
      .map(elm => `https://flv.isitetv.com/media/video/${elm.folderId}/video_url_${elm.videoId}_${elm.folderId}.m4v`).join('|');
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