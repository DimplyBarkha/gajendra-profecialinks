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
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        await context.evaluate(() => {
            function addHiddenDiv(id, content, index) {
                const newDiv = document.createElement('div');
                newDiv.id = id;
                newDiv.textContent = content;
                newDiv.style.display = 'none';
                const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[index];
                originalDiv.parentNode.insertBefore(newDiv, originalDiv);
            }
            var productdata = document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext() ? document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent : "";
            var productInfoJson = JSON.parse(productdata);
            console.log(productInfoJson)
            // @ts-ignore
            const itemList = productInfoJson.itemListElement;
            
            if (itemList && itemList.length) {
                for (let i = 0; i < itemList.length; i++) {
                    if (itemList[i].item.aggregateRating && Object.keys(itemList[i].item.aggregateRating).length > 1) {
                        const finalValue = itemList[i].item.aggregateRating.ratingValue
                        if (finalValue !== 'undefined') {
                            const newDiv = document.createElement('div');
                            const newDivUrl = document.createElement('url');
                            newDiv.id = 'rating';
                            newDivUrl.id = 'url';
                            newDiv.textContent = finalValue;
                            newDivUrl.textContent = itemList[i].item.url;
                            newDiv.style.display = 'none';
                            const originalDiv = document.querySelectorAll("figure[class='m-figureCard__figure card m-plp-product-card m-card']")[i];
                            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
                            originalDiv.parentNode.insertBefore(newDivUrl, originalDiv);
                        }
                        var productdata = document.evaluate('//script[@class="next-head"][3]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
                        if (productdata != null) {
                            var productInfoJson = JSON.parse(productdata);
                            console.log(productInfoJson)
                            // var brandBlock1 = document.querySelector('head > script:nth-child(99)');
                            // @ts-ignore
                            const lengthArray = productInfoJson.itemListElement.length;
                            // @ts-ignore
                            const itemList = productInfoJson.itemListElement;
                            // alert(itemList[0].item)
                            for (let i = 0; i <= lengthArray-1; i++) {
                                if (Object.keys(itemList[i].item.aggregateRating).length > 1) {
                                    const finalValue = itemList[i].item.aggregateRating.ratingValue;
                                    const url = itemList[i].item.url;
                                    addHiddenDiv('finalValue', finalValue, i);
                                    addHiddenDiv('url', url, i);
                                    i++;
                                }
                                else {
                                    i++;
                                }
                                // var finalValue = itemList[i].item.url
                                // console.log("test" + finalValue)
                            }

                        }
                    }
                }
            }

                    });
        return await context.extract(productDetails, { transform });
    },
}
