const { cleanUp } = require('./transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ES',
        store: 'bebitus',
        transform: cleanUp,
        domain: 'bebitus.com',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { productDetails } = dependencies;
        const { transform } = parameters;

        const iframeSelector = await context.evaluate(async() => { document.querySelector("div[class*='video-wrapper']") });
        if (iframeSelector) {
            await context.evaluate(async(iframeSelector) => {
                const mainBody = document.querySelector('body');
                const iframe = await document.querySelector(iframeSelector);
                const iframeDoc = iframe.contentDocument;
                const video = await iframeDoc.querySelector("div[class*='video-wrapper']>iframe");
                const videoSrc = video.getAttribute('src');
                mainBody.setAttribute('video-src', videoSrc);
            }, iframeSelector);
        }

        return await context.extract(productDetails, { transform });
    }
};