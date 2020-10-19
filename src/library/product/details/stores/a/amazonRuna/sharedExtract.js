module.exports.implementation = async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const productPrimeCheck = async() => {
        console.log('EXECUTING PRIME RELATED CODE.');
        let primeValue = 'No';
        const merchantAnchors = document.querySelectorAll('#merchant-info a');
        const buyBoxSpans = document.querySelectorAll('#buybox span');
        const metaNames = document.querySelectorAll('meta[name]');
        const merchantEle = document.querySelectorAll('#merchant-info');

        const findMatchingString = (nodeList) => {
            return new Promise((resolve, reject) => {
                for (const node of nodeList) {
                    const text = node.textContent;

                    if (text.match(/sold by amazon/ig)) {
                        return resolve('Yes - Shipped & Sold');
                    } else if (text.match(/fulfilled by amazon/ig)) {
                        return resolve('Yes - Fulfilled');
                    } else if (text.match(/prime pantry/ig)) {
                        return resolve('Prime Pantry');
                    }
                }

                return resolve(undefined);
            });
        };

        if (document.querySelector('i#burjActionPanelAddOnBadge.a-icon.a-icon-addon')) {
            primeValue = 'Add-On';
        }

        if (document.querySelector('body').innerHTML.match(/Exclusively for Prime Members/ig)) {
            return 'Prime Exclusive';
        }

        if (merchantAnchors && merchantAnchors.length) {
            const res = await findMatchingString(merchantAnchors);

            if (res) {
                primeValue = res;
            }
        }

        if (buyBoxSpans && buyBoxSpans.length) {
            const res = await findMatchingString(buyBoxSpans);

            if (res) {
                primeValue = res;
            }
        }

        if (metaNames && metaNames.length) {
            const res = await findMatchingString(metaNames);

            if (res) {
                primeValue = res;
            }
        }

        if (merchantEle && merchantEle.length) {
            const res = await findMatchingString(merchantEle);

            if (res) {
                primeValue = res;
            }
        }

        console.log('Prime' + primeValue);

        function addEleToDoc(key, value) {
            const prodEle = document.createElement('div');
            prodEle.id = key;
            prodEle.textContent = value;
            prodEle.style.display = 'none';
            document.body.appendChild(prodEle);
        }
        addEleToDoc('primeValue', primeValue);
    };

    const applyScroll = async function(context) {
        await context.evaluate(async function() {
            let scrollTop = 0;
            while (scrollTop !== 20000) {
                await stall(500);
                scrollTop += 500;
                window.scroll(0, scrollTop);
                if (scrollTop === 20000) {
                    await stall(5000);
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

    const mainURL = await context.evaluate(function() {
        return document.URL;
    });

    try {
        console.log('Executing navigation to sellers');
        const navigateLink = await context.evaluate(function() {
            return document.evaluate('//span[contains(@data-action,\'show-all-offers-display\')]//a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href;
        });
        console.log('navigateLink' + navigateLink);
        await context.goto(navigateLink, {
            timeout: 20000,
            waitUntil: 'load',
            checkBlocked: true,
        });
        console.log('Done navigation to sellers');

        const otherSellersTable = await context.evaluate(function() {
            return document.getElementById('olpOfferList').innerHTML;
        });
        console.log('otherSellersTable' + otherSellersTable);
        console.log('mainURL' + mainURL);
        await context.goto(mainURL, {
            timeout: 20000,
            waitUntil: 'load',
            checkBlocked: false,
            js_enabled: true,
            css_enabled: false,
            random_move_mouse: true,
        });
        await context.evaluate(function(eleInnerHtml) {
            document.body.innerHTML += eleInnerHtml;
            const addonSectionEle = document.querySelector('#moreBuyingChoices_feature_div > div > #mbc-action-panel-wrapper');
            if (addonSectionEle) {
                addonSectionEle.parentNode.removeChild(addonSectionEle);
            }
            const addonMerchantEle = document.querySelector('#merchant-info');
            if (addonMerchantEle) {
                addonMerchantEle.parentNode.removeChild(addonMerchantEle);
            }
        }, otherSellersTable);
    } catch (err) {
        console.log('Additional other sellers error -' + JSON.stringify(err));
        await context.goto(mainURL, {
            timeout: 20000,
            waitUntil: 'load',
            checkBlocked: false,
            js_enabled: true,
            css_enabled: false,
            random_move_mouse: true,
        });
    }

    await applyScroll(context);

    try {
        await context.waitForSelector('#aplus', { timeout: 30000 });
    } catch (err) {
        console.log('Manufacturer details did not load.');
    }
    await context.waitForSelector('div#altImages ul', { timeout: 50000 });

    await context.evaluate(productPrimeCheck);
    return await context.extract(productDetails, { transform });
}