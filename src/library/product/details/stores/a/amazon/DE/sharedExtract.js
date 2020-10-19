module.exports.implementation = async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async() => {
        function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
        }
        async function buttonCheck() {
            const button = '#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a, #mbc-olp-link';
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!document.querySelector(button)) {
                return button;
            } else {
                return 'false';
            }
        }
        // addHiddenDiv('added-parentInput', parentInput);
        var element = (document.querySelectorAll("div[cel_widget_id*='aplus'] img")) ? document.querySelectorAll("div[cel_widget_id*='aplus'] img") : [];
        if (element) {
            element.forEach(async(node) => {
                node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            });
        }
        // @ts-ignore
        var CurrentSeller = document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
        // @ts-ignore
        var CurrentSellerPrice = document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
        // @ts-ignore
        var CurrentSellerShipping = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

        // @ts-ignore
        var CurrentSellerPrime = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

        if (CurrentSeller && CurrentSeller.search('Verkauf durch Amazon') < 0 && CurrentSeller.match(/Verkauf durch (?:(.*) und |(.*).)/i)) {
            CurrentSeller = (CurrentSeller.match(/Verkauf durch (?:(.*) und |(.*).)/i)[1]) ? CurrentSeller.match(/Verkauf durch (?:(.*) und |(.*).)/i)[1] : CurrentSeller.match(/Verkauf durch (?:(.*) und |(.*).)/i)[2];
            if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
            if (CurrentSellerPrime.includes('Details')) {
                CurrentSellerPrime = 'YES';
            } else {
                CurrentSellerPrime = 'NO';
            }
            addHiddenDiv('ii_otherSellersName', CurrentSeller);
            addHiddenDiv('ii_otherSellersPrice', CurrentSellerPrice);
            addHiddenDiv('ii_otherSellersShipping', CurrentSellerShipping);
            addHiddenDiv('ii_otherSellersPrime', CurrentSellerPrime);
            console.log('CurrentSeller', CurrentSeller);
            console.log('CurrentSellerPrice', CurrentSellerPrice);
            console.log('CurrentSellerShipping', CurrentSellerShipping);
            console.log('CurrentSellerPrime', CurrentSellerPrime);
        }

        const otherSellerNew = (document.querySelector("span[data-action='show-all-offers-display'] > a")) ? document.querySelector("span[data-action='show-all-offers-display'] > a").getAttribute('href') : '';
        if (otherSellerNew) {
            const otherSellersHtml = await fetch(otherSellerNew, {
                headers: {
                    cookie: document.cookie,
                },
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.text());
            // console.log('otherSellersHtml', otherSellersHtml);
            const domParser = new DOMParser();
            const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
            const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!pageNotFound) {
                getLbb(otherSellersDocument);
                getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
            } else {
                getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
            }
        } else {
            getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
        }

        function getOtherSellersInfo(otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
            const samePageFlag = !otherSellersDocument ? 1 : 0;
            otherSellersDocument = otherSellersDocument || document;
            const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
            const sellerNames = [];
            otherSellersName && otherSellersName.forEach(name => {
                if (name.tagName === 'IMG') {
                    sellerNames.push(name.alt);
                } else {
                    sellerNames.push(name.innerText.trim());
                }
            });
            sellerNames && addHiddenDiv('pd_otherSellerName', sellerNames.join('|'));
            console.log('sellerNames', sellerNames);
            const sellerPrices = [];
            const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
            otherSellersPrice && otherSellersPrice.forEach(price => {
                if (price.innerText) {
                    sellerPrices.push(price.innerText.trim());
                    addHiddenDiv('pd_otherSellersPrice', price.innerText.trim());
                }
            });
            // sellerPrices && addHiddenDiv('pd_otherSellersPrice', sellerPrices.join('|'));
            console.log('sellerPrices', sellerPrices);
            const sellerPrime = [];
            const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
            otherSellersPrime && otherSellersPrime.forEach(prime => {
                if (prime.innerText.includes('Details') && samePageFlag) {
                    sellerPrime.push('Yes');
                } else if (prime.querySelector('i.a-icon-prime')) {
                    sellerPrime.push('Yes');
                } else {
                    sellerPrime.push('No');
                }
            });
            sellerPrime && addHiddenDiv('pd_otherSellersPrime', sellerPrime.join('|'));
            console.log('sellerPrime', sellerPrime);
            const sellerShipping = [];
            const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
            otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
                shipping = shipping ? shipping.innerText.toLowerCase() : '';
                if (shipping && shipping.includes('kostenlose')) {
                    sellerShipping.push('0.00');
                } else if (shipping && shipping.match(/.([\d]+(?:.[\d]+)?)/)) {
                    sellerShipping.push(shipping.match(/.([\d]+(?:.[\d]+)?)/)[1]);
                }
            });
            while (sellerShipping.length !== sellerNames.length) {
                sellerShipping.push('0.00');
            }
            sellerShipping && addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join('|'));
            console.log('sellerShipping', sellerShipping);
        }
        // @ts-ignore
        async function getLbb(otherSellersDocument) {
            const button = await buttonCheck();
            const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
            console.log('##############################', button);
            if (button !== 'false' && otherSellersDocument.querySelector(otherSellersDiv)) {
                console.log('trying button', button);
                const firstCheck = (document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div')) ? document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div') : '';
                const otherSellers = (otherSellersDocument.querySelectorAll(otherSellersDiv)) ? otherSellersDocument.querySelectorAll(otherSellersDiv) : '';
                const price = (document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']")) ? document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']") : '';
                console.log('Verkauf durch box, otherSellers, Actual-price', firstCheck, otherSellers, price);
                if (firstCheck && price) {
                    // @ts-ignore
                    const priceText = parseFloat((price.innerText).slice(1));
                    // @ts-ignore
                    if (!(firstCheck.innerText.toLowerCase().includes('verkauf durch amazon')) && otherSellers) {
                        otherSellers.forEach((seller) => {
                            // @ts-ignore
                            const sellerPrice = (seller.querySelector('span.olpOfferPrice')) ? seller.querySelector('span.olpOfferPrice').innerText.trim() : '';
                            const priceNum = parseFloat(sellerPrice.slice(1));
                            const soldBy = (seller.querySelector('h3.olpSellerName span , h3.olpSellerName img')) ? seller.querySelector('h3.olpSellerName span , h3.olpSellerName img') : '';
                            let sellerNames;
                            if (soldBy.tagName === 'IMG') {
                                sellerNames = (soldBy.alt);
                            } else {
                                sellerNames = (soldBy.innerText.trim());
                            }
                            console.log('Name of seller', sellerNames, priceNum, priceText);
                            // @ts-ignore
                            if (sellerNames.toLowerCase().includes('amazon.de') && priceNum >= priceText) {
                                addHiddenDiv('ii_lbb', 'YES');
                                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
                            }
                        });
                    }
                }
            }
        }
    });

    return await context.extract(productDetails, { transform });
}