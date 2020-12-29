const { transform } = require("../shared");

module.exports = {
    implements: 'product/reviews/extract',
    parameterValues: {
        country: 'US',
        store: 'petsmart',
        transform: transform,
        domain: 'petsmart.com',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.waitForSelector('ol[class*="content-list-reviews"]');
        await context.evaluate(async() => {
            async function removeBtn(dateSelector, btnSelector) {    
                if (!document.body.getAttribute('firstrevdate')) {
                    let div = document.querySelector(dateSelector);        
                    console.log(div)
                    document.body.setAttribute('firstrevdate', div.getAttribute('content'));
                }    
                function monthDiff(d1, d2) {
                    let months;        
                    months = (d2.getFullYear() - d1.getFullYear()) * 12;        
                    months -= d1.getMonth();        
                    months += d2.getMonth();
                    return months <= 0 ? 0 : months;
                }    
                const firstDate = new Date(document.body.getAttribute('firstrevdate'));    
                const divs = document.querySelectorAll(dateSelector);    
                divs.forEach((meta) => {
                    const date = new Date(meta.getAttribute('content'));
                    if (monthDiff(date, firstDate) !== 0) {
                        if (document.querySelector(btnSelector)) {
                            document.querySelectorAll(btnSelector).forEach((btn) => {
                                btn.remove();
                                console.error("Button Removed")
                            })
                        }
                    }
                });
            }

            removeBtn('ol[class*="content-list-reviews"] meta[itemprop="datePublished"]', 'a[class*="bv-content-btn-pages-last"]');
        });
        const { transform } = parameters;
        const { productReviews } = dependencies;
        return await context.extract(productReviews, { transform });
    }

};