const { cleanUp } = require('../../../../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'quill',
        transform: cleanUp,
        domain: 'quill.com',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.evaluate(async() => {
            function getDivWithId(id) {
                const div = document.createElement('div');
                div.setAttribute('id', id);
                return div;
            }
            if (document.querySelector('div[id*="PopUp"]')) {
                try { document.querySelector('img[title*="Close Message"]').click(); } catch (e) { console.log("Pop Up did not appered"); }

                const videos = document.querySelectorAll('video');
                if (videos) {
                    videos.forEach((v) => {
                        const div = getDivWithId('videos');
                        div.setAttribute('data', v.getAttribute('src'));
                    });
                }
                if (document.querySelector('div[class*="addToCartBtnLinks "] a[class*="button"] > span')) {
                    document.querySelector('div[class*="addToCartBtnLinks "] a[class*="button"] > span').innerText = 'In Stock';
                }
            }

            function  stall (ms)  {
                return  new  Promise((resolve,  reject)  =>  {
                    setTimeout(()  =>  {
                        resolve();
                    },  ms);
                });
            }
            await  stall(2000);
        });
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    },
};