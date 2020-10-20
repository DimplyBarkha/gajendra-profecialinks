module.exports.implementation = async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(async() => {
        function removeDuplicates(array) {
            array.splice(0, array.length, ...(new Set(array)))
        };
        let getRank = document.querySelectorAll('#detailBulletsWrapper_feature_div ul span');
        let rankDetails;
        let product_rank = [];
        let product_rank_category = [];
        getRank.forEach((element) => {
            if (element.innerText && element.innerText.includes('Best Sellers Rank') && element.innerText.includes('#')) {

                rankDetails = element.innerText.split('Best Sellers Rank: ')[1].split('\n');
                if (rankDetails.length) {
                    for (let i = 0; i < rankDetails.length; i++) {
                        product_rank.push(rankDetails[i].split(' ')[0].trim().replace(/#/, '').replace(/,/g, "").trim());
                        product_rank_category.push(rankDetails[i].replace(/^[#,0-9 in]+/, '').trim());
                    }
                }
                console.log(rankDetails)
            }
        });
        removeDuplicates(product_rank);
        removeDuplicates(product_rank_category);
        for (let i = 0; i < product_rank.length; i++) {
            const div = document.createElement('div');
            div.className = 'rank';
            const getInput = document.createElement('li');
            getInput.id = 'rank';
            div.appendChild(getInput);
            document.body.appendChild(div);
            getInput.setAttribute('value', product_rank[i]);
        }
        let category = product_rank_category.join(' | ');
        document.head.setAttribute('category', category);
    });

    const productPrimeCheck = async() => {
        console.log('EXECUTING PRIME RELATED CODE.');
        let primeValue = 'No';
        const merchantAnchors = document.querySelectorAll('#merchant-info a');
        const buyBoxSpans = document.querySelectorAll('#buybox span');
        const metaNames = document.querySelectorAll('meta[name]');

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

    const scrollToContent = async(selector) => {
        await context.evaluate(async(selectorToScrollTo) => {
            function scrollToSmoothly(pos, time) {
                return new Promise((resolve, reject) => {
                    if (isNaN(pos)) {
                        return reject(new Error('Position must be a number'));
                    }
                    if (pos < 0) {
                        return reject(new Error('Position can not be negative'));
                    }
                    var currentPos = window.scrollY || window.screenTop;
                    if (currentPos < pos) {
                        var t = 10;
                        for (let i = currentPos; i <= pos; i += 10) {
                            console.log('Scrolling');
                            t += 10;
                            setTimeout(function() {
                                window.scrollTo(0, i);
                            }, t / 2);
                        }
                        return resolve();
                    } else {
                        time = time || 100;
                        var i = currentPos;
                        var x;
                        x = setInterval(function() {
                            window.scrollTo(0, i);
                            i -= 10;
                            if (i <= pos) {
                                clearInterval(x);
                            }
                        }, time);

                        return resolve();
                    }
                });
            }
            const elem = document.querySelector(selectorToScrollTo);
            if (!elem) {
                return;
            }
            await scrollToSmoothly(elem.offsetTop);
        }, selector);
    };

    const mainURL = await context.evaluate(function() {
        return document.URL;
    });

    try {
        console.log('Executing navigation to sellers');
        const navigateLink = await context.evaluate(function() {
            return document.querySelector('span[data-action="show-all-offers-display"] > a').href;
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
            timeout: 10000,
            waitUntil: 'load',
            checkBlocked: false,
            js_enabled: true,
            css_enabled: false,
            random_move_mouse: true,
        });
        await context.evaluate(function(eleInnerHtml) {
            const cloneNode = document.createElement('div');
            cloneNode.innerHTML = eleInnerHtml;
            document.querySelector('span[data-action="show-all-offers-display"]').appendChild(cloneNode);
            const addonSectionEle = document.querySelector('#moreBuyingChoices_feature_div > div > #mbc-action-panel-wrapper');
            addonSectionEle.parentNode.removeChild(addonSectionEle);
        }, otherSellersTable);
    } catch (err) {
        console.log('Additional other sellers error -' + JSON.stringify(err));
        await context.goto(mainURL, {
            timeout: 10000,
            waitUntil: 'load',
            checkBlocked: false,
            js_enabled: true,
            css_enabled: false,
            random_move_mouse: true,
        });
    }

    try {
        await scrollToContent('#descriptionAndDetails');
    } catch (err) {
        console.log('Product description is not found.');
    }
    await scrollToContent('#reviewsMedley');
    await scrollToContent('.askDetailPageSearchWidgetSection');

    try {
        await context.waitForSelector('#aplus', { timeout: 30000 });
    } catch (err) {
        console.log('Manufacturer details did not load.');
    }

    await scrollToContent('div[data-cel-widget="aplus_feature_div"]');

    await context.evaluate(productPrimeCheck);

    return await context.extract(productDetails, { transform });
}