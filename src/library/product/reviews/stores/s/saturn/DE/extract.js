const { transform } = require("../shared");

module.exports = {
    implements: 'product/reviews/extract',
    parameterValues: {
        country: 'DE',
        store: 'saturn',
        transform: transform,
        domain: 'saturn.de',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.evaluate(async() => {

            let divs = document.querySelectorAll('div[data-test="mms-customer-rating"]');
            divs.forEach((div) => {
                let rating = 0;
                div.childNodes.forEach((d) => { if (d.getAttribute('class').includes('iJmaKv')) { rating++ } })
                div.setAttribute('ratings', rating.toString())
            })

            async function removeBtn(dateSelector, btnSelector) {
                if (!document.body.getAttribute('firstrevdate')) {
                    let div = document.querySelector(dateSelector);
                    console.log(div)
                    document.body.setAttribute('firstrevdate', div.textContent);
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
                    const date = new Date(meta.textContent);
                    if (monthDiff(date, firstDate) !== 0) {
                        if (document.querySelector(btnSelector)) {
                            document.querySelectorAll(btnSelector).forEach((btn) => {
                                btn.remove();
                            })
                        }
                    }
                });
            }
            await removeBtn('section[id*="reviews"] div[class*="Cardstyled__StyledCardWrapper"] div[class*="FlexBox__StyledBox"]:nth-child(1) > div:nth-child(2) span', 'span[class*="ReviewsPaginationWrapper"] button');
        });
        const { transform } = parameters;
        const { productReviews } = dependencies;
        return await context.extract(productReviews, { transform });
    }

};