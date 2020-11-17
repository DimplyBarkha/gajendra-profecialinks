const { transform } = require('./transform');

async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    async function getVideoLinks() {
        const iframeSelector_1 = 'div.videoContainer iframe';
        const iframeSelector_2 = 'div[class *= "video-container"] iframe';

        const iframe = document.querySelector(iframeSelector_1) || document.querySelector(iframeSelector_2);
        if (!iframe) {
            console.log('iframe not found..video will miss');
            return;
        };
        const response = await fetch(iframe.src);
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
        country: 'IE',
        store: 'boots',
        transform,
        domain: 'boots.ie',
        zipcode: '',
    },
    implementation,
};