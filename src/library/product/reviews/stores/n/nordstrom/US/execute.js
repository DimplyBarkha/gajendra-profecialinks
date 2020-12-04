
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

  async function getData (reviewUrl, pageNum) {
    reviewUrl = reviewUrl.replace('pageNum', pageNum);
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
  if (url.match(/\/(\d+)/)) {
    const reviewURL = `https://public.api.nordstrom.com/review/review?apikey=CmArA4X9AwbooxUJ3EptGmr2kSfoH6EQ&styleid=${url.match(/\/(\d+)/)[1]}&page=pageNum&pagesize=10&starrating=&sortby=-submissiontime&searchTerm=&feature=&hasPhotos=false`;
    const targetReviews = await getData(reviewURL, 1);
    extractedReviews = extractedReviews.concat(targetReviews.reviews);
    console.log('Page #1 API call done');
    const totalReviews = targetReviews.totalResults;
    console.log('Total reviews present' + totalReviews);
    if (extractedReviews.length === 0) {
      return false;
    }

    const lastReviewDate = extractedReviews[0].submissionDate;
    console.log('Last review date' + lastReviewDate);
    const firstReviewDate = extractedReviews[extractedReviews.length - 1].submissionDate;
    if (checkIfReviewIsFromLast30Days(lastReviewDate, firstReviewDate) && totalReviews > 10) {
      // Have more reviews that falls under last 30 days
      const expectedPages = Math.round(totalReviews / 10);
      console.log('Pages found' + expectedPages);
      for (let i = 2; i < expectedPages + 1; i++) {
        const targetReviews = await getData(reviewURL, i);
        extractedReviews = extractedReviews.concat(targetReviews.reviews);
        if (!checkIfReviewIsFromLast30Days(lastReviewDate, targetReviews.reviews[targetReviews.reviews.length - 1].submissionDate)) {
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
        const rawDate = new Date(reviewDate);
        let month = (rawDate.getMonth() + 1).toString();
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

      function getVerifiedPurchaseValue (badges) {
        if (!badges) {
          return '';
        }

        for (let i = 0; i < badges.length; i++) {
          if (badges[i].name === 'VerifiedPurchaser') {
            console.log('Found verified purchase');
            return 'Yes';
          }
        }
        return '';
      }

      for (let i = 0; i < reviews.length; i++) {
        if (!checkIfReviewIsFromLast30Days(lastReviewDate, reviews[i].submissionDate)) {
          return;
        }

        const div = document.createElement('div');
        div.id = reviews[i].id;
        div.className = 'extract-reviews';

        const comment = document.createElement('span');
        comment.setAttribute('name', reviews[i].comment);
        div.appendChild(comment);

        const positiveVoteCount = document.createElement('span');
        positiveVoteCount.setAttribute('name', reviews[i].positiveVoteCount ? reviews[i].positiveVoteCount : '');
        div.appendChild(positiveVoteCount);

        const submissionDate = document.createElement('span');
        submissionDate.setAttribute('name', getFormattedDate(reviews[i].submissionDate));
        div.appendChild(submissionDate);

        const starRating = document.createElement('span');
        starRating.setAttribute('name', reviews[i].starRating);
        div.appendChild(starRating);

        const title = document.createElement('span');
        title.setAttribute('name', reviews[i].title);
        div.appendChild(title);

        const verifiedPurchaser = document.createElement('span');
        verifiedPurchaser.setAttribute('name', getVerifiedPurchaseValue(reviews[i].badges));
        div.appendChild(verifiedPurchaser);

        const userNickname = document.createElement('span');
        userNickname.setAttribute('name', reviews[i].userNickname ? reviews[i].userNickname : '');
        div.appendChild(userNickname);

        const productUrl = document.createElement('span');
        productUrl.setAttribute('name', destinationUrl);
        div.appendChild(productUrl);

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
    store: 'nordstrom',
    domain: 'nordstrom.com',
    loadedSelector: '#product-page-reviews',
    noResultsXPath: '//h1[contains(.,"cannot be found")] | //h1[contains(.,"No results")]',
  },
  implementation,
};
