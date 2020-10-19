module.exports.implementation = async function implementation(
    inputs, { country, store, transform, domain },
    context, { productDetails },
) {
    await context.evaluate(async() => {
        let rating = document.querySelector('span[data-hook="rating-out-of-text"]') ? document.querySelector('span[data-hook="rating-out-of-text"]').innerText : null;
        if (rating)
            rating = rating.split('von')[0];
        document.head.setAttribute('rating', rating);
        let material = document.querySelectorAll('div#feature-bullets ul li');
        let getMaterial = []
        material.forEach((element) => {
            if (element.innerText && element.innerText.includes('material')) {
                let materials = element.innerText;
                getMaterial.push(materials);
            }
        });
        let materials = getMaterial.join('|')
        document.head.setAttribute('materials', materials);

        function removeDuplicates(array) {
            array.splice(0, array.length, ...(new Set(array)))
        };
        let getRank = document.querySelectorAll('#SalesRank');
        let rankDetails;
        let product_rank = [];
        let product_rank_category = [];
        getRank.forEach((element) => {
            console.log(element)
            if (element.innerText && element.innerText.includes('Amazon Bestseller-Rang') && element.innerText.includes('Nr.')) {

                rankDetails = element.innerText.split('Amazon Bestseller-Rang: ')[1].split('\n');
                console.log(rankDetails)
                if (rankDetails.length) {
                    for (let i = 0; i < rankDetails.length; i++) {
                        product_rank.push(rankDetails[i].split(' ')[1].trim().replace(/Nr./, '').replace(/,/g, "").trim());
                        product_rank_category.push(rankDetails[i].replace(/^[Nr.,0-9 in]+/, '').trim());
                    }
                }
                console.log(rankDetails)
            }
        });
        removeDuplicates(product_rank);
        removeDuplicates(product_rank_category);
        let rank = product_rank.join(' | ');
        let category = product_rank_category.join(' | ');
        document.head.setAttribute('rank', rank);
        document.head.setAttribute('category', category);

    });
    const isVideoPresent = await context.evaluate(async function() {
        return document.querySelector('li.videoThumbnail');
    });

    if (isVideoPresent) {
        await context.click('li.videoThumbnail');
        await context.waitForSelector('div#main-video-container video');
    }

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

        document.querySelector('body').setAttribute('primeValue', primeValue);
    };

    await context.evaluate(productPrimeCheck);

    return await context.extract(productDetails, { transform });
}