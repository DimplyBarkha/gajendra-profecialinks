async function implementation({ url, id, zipcode, date, days }, { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
    context,
    dependencies,
) {
    const patternReplace = () => {
        if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
        let tempUrl = reviewUrl;
        if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
        if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
        if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
        return tempUrl;
    };
    const destinationUrl = url || patternReplace();
    await dependencies.goto({ url: destinationUrl, zipcode });
    let flagLoaded = false;
    while (flagLoaded) {
        try {
            await context.waitForFunction(() => {
                return Boolean(document.querySelector('#cookies-agree'));
            }, { timeout: 30000 });
            flagLoaded = true;
        } catch (err) {
            console.log('No pop found after wait');
            await context.reload();
        }
    }

    await context.evaluate(() => {
        const elem = document.querySelector('#cookies-agree');
        if (!elem) return;
        console.log('Clicking agree btn');
        elem.click();
    });
    flagLoaded = false;
    while (!flagLoaded) {
        try {
            if (loadedSelector) {
                await context.waitForFunction((sel, xp) => {
                    return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
                }, { timeout: 30000 }, loadedSelector, noResultsXPath);
                flagLoaded = true;
            }
        } catch (error) {
            console.log("Page not loaded properly... Reloading...")
            await context.reload();
        }

    }


    console.log('Checking no results', noResultsXPath);

    const checkIfResults = await context.evaluate((xp) => {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        if (e) {
            throw new Error()
        }
        return !e;
    }, noResultsXPath);

    if (!checkIfResults) {
        return false;
    }

    async function getData(reviewUrl) {
        console.log('URL passed - ' + reviewUrl);
        const data = await context.evaluate(async function(reqUrl) {
            const response = await fetch(reqUrl, {
                headers: {
                    accept: '*/*',
                },
                method: 'GET',
            });
            return response.text();
        }, reviewUrl);
        return data;
    };

    function checkIfReviewIsFromLast30Days(reviewDate) {
        const reviewDateTimestamp = new Date(reviewDate).getTime();
        console.log(`Review Date ${reviewDateTimestamp}`);
        const currentDate = new Date();
        const last30DaysTimestamp = currentDate.setMonth(currentDate.getMonth() - 1);
        console.log(`Timestamp ${last30DaysTimestamp}`);
        if (reviewDateTimestamp >= last30DaysTimestamp) {
            console.log('True');
            return true;
        }
        console.log('false');
        return false;
    }

    let extractedReviews = [];
    let last30DaysReviews = [];
    const req = await context.searchForRequest('https://api.bazaarvoice.com/data/batch.*', 'GET', 0, 60);
    let data = (req && req.status === 200 && req.responseBody && req.responseBody.body) ? req.responseBody.body : null;
    console.log('req' + req.url);
    data = data.replace(/BV._internal.dataHandler0\((.+)\)/, '$1');
    data = JSON.parse(data);
    const totalReviews = data.BatchedResults.q1.TotalResults;
    console.log('Total results' + totalReviews);

    if (data.BatchedResults.q1 && data.BatchedResults.q1.Results.length === 0) {
        console.log('No results found');
        return false;
    }

    let apiReviews = [];
    const expectedPages = Math.round(totalReviews / 100);
    console.log('Pages found' + expectedPages);
    for (let i = 0; i < expectedPages; i++) {
        const apiRequestURL = req.url.replace(/limit.q1=8/, 'limit.q1=100').replace(/offset.q1=0/, `offset.q1=${i}`);
        let targetReviews = await getData(apiRequestURL);
        targetReviews = targetReviews.replace(/BV._internal.dataHandler0\((.+)\)/, '$1');
        targetReviews = JSON.parse(targetReviews);
        apiReviews = apiReviews.concat(targetReviews.BatchedResults.q1.Results);
        if (apiReviews.length !== 0) {
            extractedReviews = apiReviews;
        }
    }

    console.log('Extracted reviews' + extractedReviews.length);

    for (let reviews of extractedReviews) {
        if (!checkIfReviewIsFromLast30Days(reviews.SubmissionTime)) {
            break;
        }
        last30DaysReviews.push(reviews);
    }

    // Get the product details
    const productDetails = await context.evaluate(function() {
        const brand = document.evaluate('//*[@class=\'product_detail-brand\']', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        const name = document.evaluate('//*[contains(@class,"product_detail-title")]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        const sku = document.evaluate('//div[@id=\'product-detail-container\']/@data-product-id', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        const gtin = document.evaluate('//span[contains(@class,\'js-product-gtin-number\')]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();

        return {
            brand: brand ? brand.textContent : '',
            name: name ? name.textContent : '',
            sku: sku ? sku.textContent : '',
            gtin: gtin ? gtin.textContent : '',
        };
    });

    // Bind the reviews to DOM
    await context.evaluate(function(reviews, productDetails, destinationUrl) {
        function getVerifiedPurchaseValue(badges) {
            if (!badges) {
                return '';
            }

            for (let i = 0; i < badges.length; i++) {
                if (badges[i] === 'verifiedPurchaser') {
                    console.log('Found verified purchase');
                    return 'Yes';
                }
            }
            return '';
        }
        for (let i = 0; i < reviews.length; i++) {
            const div = document.createElement('div');
            div.id = reviews[i].id;
            div.className = 'extract-reviews';

            const comment = document.createElement('span');
            comment.setAttribute('name', reviews[i].ReviewText);
            div.appendChild(comment);

            const positiveVoteCount = document.createElement('span');
            positiveVoteCount.setAttribute('name', reviews[i].TotalPositiveFeedbackCount);
            div.appendChild(positiveVoteCount);

            const submissionDate = document.createElement('span');
            submissionDate.setAttribute('name', reviews[i].SubmissionTime);
            div.appendChild(submissionDate);

            const starRating = document.createElement('span');
            starRating.setAttribute('name', reviews[i].Rating);
            div.appendChild(starRating);

            const title = document.createElement('span');
            title.setAttribute('name', reviews[i].Title);
            div.appendChild(title);

            const verifiedPurchaser = document.createElement('span');
            verifiedPurchaser.setAttribute('name', getVerifiedPurchaseValue(reviews[i].BadgesOrder));
            div.appendChild(verifiedPurchaser);

            const userNickname = document.createElement('span');
            userNickname.setAttribute('name', reviews[i].UserNickname ? reviews[i].UserNickname : '');
            div.appendChild(userNickname);

            const syndicatedSrc = document.createElement('span');
            syndicatedSrc.setAttribute('name', reviews[i].SyndicationSource ? reviews[i].SyndicationSource.Name : '');
            div.appendChild(syndicatedSrc);

            const brand = document.createElement('span');
            brand.setAttribute('name', productDetails.brand);
            div.appendChild(brand);

            const productName = document.createElement('span');
            productName.setAttribute('name', productDetails.name);
            div.appendChild(productName);

            const sku = document.createElement('span');
            sku.setAttribute('name', productDetails.sku);
            div.appendChild(sku);

            const gtin = document.createElement('span');
            gtin.setAttribute('name', productDetails.gtin);
            div.appendChild(gtin);

            const reviewedSku = document.createElement('span');
            reviewedSku.setAttribute('name', productDetails.sku);
            div.appendChild(reviewedSku);

            const productUrl = document.createElement('span');
            productUrl.setAttribute('name', destinationUrl);
            div.appendChild(productUrl);

            document.body.appendChild(div);
        }
    }, last30DaysReviews, productDetails, destinationUrl);

    return true;
}

module.exports = {
    implements: 'product/reviews/execute',
    parameterValues: {
        country: 'ES',
        store: 'elcorteingles',
        domain: 'elcorteingles.es',
        loadedSelector: 'ol.bv-content-list-reviews > li',
        noResultsXPath: '//button[contains(.,"Escribe la primera opinión de este producto")] | //div[contains(@class, "guided_search-navigation")]',
    },
    implementation,
};