async function implementation (
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  // sample - https://github.com/import-io/robot-library/blob/Review_Extractor_example/src/library/product/reviews/stores/a/amazon/US/extract.yaml
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

  // Scroll down the page to view reviews
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  const checkIfResults = await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);

  if (!checkIfResults) {
    return false;
  }

  async function getData (reviewUrl, offsetNum) {
    reviewUrl = reviewUrl.replace('offsetNum', offsetNum);
    console.log('URL passed - ' + reviewUrl);
    const data = await context.evaluate(async function (reqUrl) {
      const response = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    }, reviewUrl);
    return data;
  };

  function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
    console.log('lastDate' + lastDate);
    console.log('reviewDate' + reviewDate);
    const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    console.log('timestamp' + timestamp);
    console.log(new Date(reviewDate).getTime());
    if (new Date(reviewDate).getTime() >= timestamp) {
      console.log('True');
      return true;
    }
    console.log('false');
    return false;
  }

  // Get the reviews using API
  let extractedReviews = [];
  if (destinationUrl.match(/\/(\d+)/)) {
    const reviewURL = `https://www.lowes.com/rnr/r/get-by-product/${url.match(/\/(\d+)/)[1]}/pdp/prod?offset=offsetNum&sortMethod=SubmissionTime&sortDirection=desc`;
    let offset = 0;
    const targetReviews = await getData(reviewURL, offset);
    extractedReviews = extractedReviews.concat(targetReviews.Results);
    console.log('Page #1 API call done');
    const totalReviews = targetReviews.TotalResults;
    console.log('Total reviews present' + totalReviews);
    if (extractedReviews.length === 0) {
      return false;
    }

    const lastReviewDate = extractedReviews[0].SubmissionTime;
    console.log('Last review date' + lastReviewDate);
    const firstReviewDate = extractedReviews[extractedReviews.length - 1].SubmissionTime;
    if (checkIfReviewIsFromLast30Days(lastReviewDate, firstReviewDate) && totalReviews > 10) {
      // Have more reviews that falls under last 30 days
      const expectedPages = Math.round(totalReviews / 10);
      console.log('Pages found' + expectedPages);
      for (let i = 2; i < expectedPages + 1; i++) {
        offset += 10;
        const targetReviews = await getData(reviewURL, offset);
        extractedReviews = extractedReviews.concat(targetReviews.Results);
        if (!checkIfReviewIsFromLast30Days(lastReviewDate, targetReviews.Results[targetReviews.Results.length - 1].SubmissionTime)) {
          break;
        }
      }
    }
    // Bind the reviews to DOM
    await context.evaluate(function (reviews, lastReviewDate, destinationUrl) {
      function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
        console.log('lastDate' + lastDate);
        console.log('reviewDate' + reviewDate);
        const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
        console.log('timestamp' + timestamp);
        console.log(new Date(reviewDate).getTime());
        if (new Date(reviewDate).getTime() > timestamp) {
          console.log('True');
          return true;
        }
        console.log('false');
        return false;
      }
      function getFormattedDate (reviewDate) {
        // reviewDate = new Date(reviewDate).getTime();
        const rawDate = convertTZ(reviewDate, 'Asia/Kolkata');
        // console.log('reviewDate formatted', rawDate);
        let month = (rawDate.getMonth() + 1).toString();
        // const hours = rawDate.getHours();
        let day = rawDate.getDate().toString();
        const year = rawDate.getFullYear().toString();

        if (month.length < 2) {
          month = `0${month}`;
        }
        if (day.length < 2) {
          day = `0${day}`;
        }
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        return formattedDate;
      }
      function convertTZ (date, tzString) {
        return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', { timeZone: tzString }));
      }

      function getVerifiedPurchaseValue (badges) {
        if (!badges) {
          return '';
        }
        if (badges.Value === 'True') {
          console.log('Found verified purchase');
          return 'Yes';
        }
        return '';
      }

      for (let i = 0; i < reviews.length; i++) {
        if (!checkIfReviewIsFromLast30Days(lastReviewDate, reviews[i].SubmissionTime)) {
          return;
        }

        const div = document.createElement('div');
        div.id = reviews[i].Id;
        div.className = 'extract-reviews';

        const comment = document.createElement('span');
        comment.setAttribute('pd_reviewText', reviews[i].ReviewText ? reviews[i].ReviewText : '');
        div.appendChild(comment);

        const positiveVoteCount = document.createElement('span');
        positiveVoteCount.setAttribute('pd_helpfulCount', reviews[i].TotalPositiveFeedbackCount ? reviews[i].TotalPositiveFeedbackCount : '');
        div.appendChild(positiveVoteCount);

        const submissionDate = document.createElement('span');
        reviews[i].SubmissionTime && submissionDate.setAttribute('pd_reviewDate', getFormattedDate(reviews[i].SubmissionTime));
        div.appendChild(submissionDate);

        const starRating = document.createElement('span');
        starRating.setAttribute('pd_reviewRating', reviews[i].Rating ? reviews[i].Rating : '');
        div.appendChild(starRating);

        const title = document.createElement('span');
        title.setAttribute('pd_reviewTitle', reviews[i].Title ? reviews[i].Title : '');
        div.appendChild(title);

        const verifiedPurchaser = document.createElement('span');
        reviews[i].ContextDataValues && reviews[i].ContextDataValues.VerifiedPurchaserCDV && verifiedPurchaser.setAttribute('pd_verifiedPurchase', getVerifiedPurchaseValue(reviews[i].ContextDataValues.VerifiedPurchaserCDV));
        div.appendChild(verifiedPurchaser);

        const userNickname = document.createElement('span');
        userNickname.setAttribute('pd_user', reviews[i].UserNickname ? reviews[i].UserNickname : '');
        div.appendChild(userNickname);

        const productUrl = document.createElement('span');
        productUrl.setAttribute('pd_productUrl', destinationUrl);
        div.appendChild(productUrl);

        const syndicatedFrom = document.createElement('span');
        reviews[i].IsSyndicated && reviews[i].SyndicationSource && reviews[i].SyndicationSource.Name && syndicatedFrom.setAttribute('pd_syndicatedFrom', reviews[i].SyndicationSource.Name);
        div.appendChild(syndicatedFrom);

        document.body.appendChild(div);
      }
    }, extractedReviews, lastReviewDate, destinationUrl);
  }

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    loadedSelector: 'section#main',
    noResultsXPath: '//h1[contains(text(), "This Page Is Missing or Moved")] | //p[@class="subTitle"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
