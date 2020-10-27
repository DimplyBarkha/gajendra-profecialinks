const implementation = async function(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
        var searchUrl = window.location.href;
        var appendElements = document.querySelectorAll(' div[class="product-wrapper"]');
        if (appendElements.length) {
            appendElements.forEach((element) => {
                element.setAttribute('searchurl', searchUrl);
            })
        }
    });
    const applyScroll = async function(context) {
        await context.evaluate(async function() {
            let scrollTop = 0;
            while (scrollTop !== 20000) {
                await stall(4000);
                scrollTop += 1000;
                window.scroll(0, scrollTop);
                if (scrollTop === 20000) {
                    await stall(6000);
                    break;
                }
            }

            function stall(ms) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, ms);
                });
            }
        });
    };
    await applyScroll(context);
    await context.waitForSelector('img[class="loaded"]', { timeout: 80000 });
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    await delay(8000);
    return await context.extract(productDetails, { transform });
};
module.exports = { implementation };