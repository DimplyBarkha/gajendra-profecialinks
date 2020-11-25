const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'MX',
        store: 'liverpool',
        transform: transform,
        domain: 'liverpool.mx',
    },
    implementation: async (inputs,
        parameters,
        context,
        dependencies,
    ) => {
        const { transform } = parameters;
        const { productDetails } = dependencies;
        await context.evaluate(() => {
            function addHiddenDiv(id, content, index) {
                const newDiv = document.createElement('div');
                newDiv.id = id;
                newDiv.textContent = content;
                newDiv.style.display = 'none';
                const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[index];
                originalDiv.parentNode.insertBefore(newDiv, originalDiv);
            }
            var brandBlock1 = document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
            var test1 = JSON.parse(brandBlock1);
            console.log(test1)
            // var brandBlock1 = document.querySelector('head > script:nth-child(99)');
            // @ts-ignore
            var lengthArray = test1.itemListElement.length;
            // @ts-ignore
            var itemList = test1.itemListElement;
            for (var i = 0; i <= lengthArray; i++) {
                var finalValue = itemList[i].item.aggregateRating.ratingValue
                var finalValue = itemList[i].item.url
                console.log("test" + finalValue)
            }
            // @ts-ignore
            //console.log("json" + JSON.parse(brandBlock1.innerText).itemListElement[1].item.aggregateRating.ratingValue);
            addHiddenDiv('finalValue', finalValue, i);
        });
        return await context.extract(productDetails, { transform });
    },
}