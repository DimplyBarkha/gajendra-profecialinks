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
            var productdata = document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
            var productInfoJson = JSON.parse(productdata);
            console.log(productInfoJson)
            // var brandBlock1 = document.querySelector('head > script:nth-child(99)');
            // @ts-ignore
            const lengthArray = productInfoJson.itemListElement.length;
            // @ts-ignore
            const itemList = productInfoJson.itemListElement;
            alert(itemList[0].item)
            for (let i = 1; i <= lengthArray; i++) {
                if (Object.keys(itemList[i].item.aggregateRating).length > 1) {
                    const finalValue = itemList[i].item.aggregateRating.ratingValue
                    const url = itemList[i].item.url
                    addHiddenDiv('finalValue', finalValue, i);
                    addHiddenDiv('url', url, i);
                    i++;
                }
                else{
                    i++;
                }
                // var finalValue = itemList[i].item.url
                // console.log("test" + finalValue)
            }
            // @ts-ignore
            //console.log("json" + JSON.parse(brandBlock1.innerText).itemListElement[1].item.aggregateRating.ratingValue);
            // addHiddenDiv('finalValue', finalValue, i);
        });
        return await context.extract(productDetails, { transform });
    },
}