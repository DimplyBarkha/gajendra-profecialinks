async function implementation(
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
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

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  try {
    await context.waitForSelector('div#Cookie', { timeout: 5000 });
  } catch (e) {
    console.log('cookies not loaded');
  }

  await context.evaluate(async function () {
    if (document.querySelector('div#Cookie')) {
      document.querySelector('button#ok_col').click();
    }
    if (document.querySelector('div.btns button.btnf-yes')) {
      document.querySelector('div.btns button.btnf-yes').click();
    }
    if (document.querySelector('div#popup_image_61')) {
      document.querySelector('div#popup_image_61 button').click();
    }
    if (document.querySelector('input#juminsag')) {
      document.getElementById('juminsag').value = '19840101';
      // if (document.querySelector('button#entrance')) {
      //   document.querySelector('button#entrance').click();
      // }
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    await context.waitForSelector('button#entrance', { timeout: 1000 });
    await context.click('button#entrance');
  } catch (e) {
    console.log('cookies not loaded');
  }

  await context.waitForNavigation({ timeout: 2000, waitUntil: 'load' });

  try {
    await context.waitForSelector('div.review_topicon a span', { timeout: 10000 });
  } catch (e) {
    console.log('review count is not loaded');
  }

  await context.evaluate(async function () {
    function addHiddenDiv(id, reviewData) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      newDiv.innerHTML = reviewData
    }

    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const page = Number(urlParams.get('page'));
    if (document.querySelector('div.review_topicon a span')) {
      const reviewString = document.querySelector('div.review_topicon a span').textContent;
      const totalReviewsCount = Number(reviewString.replace(/,/g, ''));
      console.log('totalReviewsCount ', totalReviewsCount);
      if (totalReviewsCount > 0 && page > 0) {
        // const itemStr = url.match(/(\d+).html/g)[0].replace('.html', '');
        const itemStr = url.match(/(?<=--)(.*)(?=.html)/g)[0];
        const apiUrl = `https://www.discoverglo.co.kr/store/ajax.cmt.list.php?pdtIdx=${itemStr}&cmt2page=${page}`;
        console.log(`PAGE#:${page}`);
        console.log('itemStr#: ', itemStr);

        const response = await fetch(apiUrl, {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'script',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site',
          },
          referrer: url,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        });
        if (!response || response.status !== 200) {
          return false;
        } else {
          const data = await response.json();
          console.log('API called! Adding data..');
          if (data) {
            addHiddenDiv('my-reviews', data.msg);
          }
        }
      }
    }

  });

  async function checkDate() {
    const reviewDateRaw = document.querySelector('div#my-reviews li:last-child span.date') ? document.querySelector('div#my-reviews li:last-child span.date').innerText : '';
    const topReviewDate = new Date(reviewDateRaw);
    if (topReviewDate) {
      const month = '' + (topReviewDate.getMonth() + 1);
      const day = '' + topReviewDate.getDate();
      const year = topReviewDate.getFullYear();
      console.log(`${[year, month, day].join('-')}`);
      return `${[year, month, day].join('-')}`;
    } else {
      return false;
    }
  }

  if (date) {
    if ((new Date(await context.evaluate(checkDate)).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) < 0) {
      console.log('last review date is less than input date', date);
      return false;
    }
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
    country: 'KO',
    store: 'discoverglo',
    domain: 'discoverglo.co.kr',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"error")]/h1/small[contains(text(),"Page not found")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
