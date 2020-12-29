const { transform } = require('./transform');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'TR',
        store: 'trendyol',
        transform,
        zipcode: '',
        domain: 'trendyol.com',
    },
    implementation: async(
        inputs,
        parameters,
        context,
        dependencies,
    ) => {
        await context.evaluate(async() => {
            document.body.setAttribute('link', window.location.href)

            function stall(ms) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, ms);
                });
            }

            const applyScroll = async function(lengthToScroll) {
                let scrollTop = 0;
                while (scrollTop !== 30000) {
                    await stall(500);
                    scrollTop += lengthToScroll;
                    window.scrollBy(0, lengthToScroll);
                    if (document.querySelectorAll('div.p-card-wrppr').length === parseInt(document.querySelector('.dscrptn').innerHTML.match(/(?!<!--\s-->)(\d+)(?=<!--\s-->)/g)[0]) || document.querySelectorAll('div.p-card-wrppr').length >= 150) {
                        await stall(1000);
                        break;
                    }
                }
            };
            await applyScroll(399);
            console.log("lenght of produts: " + document.querySelectorAll('div.p-card-wrppr').length)
            const cardsRating = document.querySelectorAll('div.p-card-wrppr div.ratings div.full');
            cardsRating.forEach(element => {
                element.setAttribute("rating", (parseInt(element.getAttribute("style").match(/(?!(width:))(\d+)(?:[%]?;)/g)[0].match(/\d+/g)[0]) / 100).toString())
            });
            const ratingDiv = document.querySelectorAll("div.ratings");
            ratingDiv.forEach((element) => {
                let rating = 0.0;
                const nodes = element.childNodes;
                for (let i = 0; i < 5; i++) {
                    rating += parseFloat(nodes[i].childNodes[1].getAttribute("rating"));
                };
                element.setAttribute('rating', rating.toString())
            })

        });
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    },
};