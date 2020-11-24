const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    filterReviews: null,
    domain: 'beru.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    console.log('testing19');
    console.log('here! testing12');
    // function solveCaptcha() {
    //   // eslint-disable-next-line
    //   // const js_enabled = true; // Math.random() > 0.7;
    //   // console.log('js_enabled', js_enabled); ;
  
      
    // }
    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const start = Date.now();
    const MAX_CAPTCHAS = 3;

    // let pageId;
    let captchas = 0;
    let hasCaptcha = false;
    let lastResponseData;
  
    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate("//div[contains(@class, \"captcha__image\")]//img", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (captchaEl.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };
  
    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'IMAGECAPTCHA',
        inputElement: 'form input[name="rep"]',
        imageElement: 'form img',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      context.waitForNavigation();
      console.log('Captcha vanished');
    };
    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA');
      while (await isCaptcha() === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha', await isCaptcha(), captchas);
        await solveCaptcha();
      }
      if (await isCaptcha() === 'true') {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(lastResponseData.code, 'Blocked: Could not solve CAPTCHA, attempts=' + captchas);
        }
        return false;
      }
      return true;
    };
    await context.evaluate(async function () {
      console.log('testing');
      // const showMore = document.querySelector
    });

    const reviewsURL = await context.evaluate(async function () {
      return document.querySelector('meta[property="og:url"]') ? document.querySelector('meta[property="og:url"]').getAttribute('content') : null;
    });

    const productId = await context.evaluate(async function () {
      return document.querySelector('meta[property="og:url"]') ? document.querySelector('meta[property="og:url"]').getAttribute('content').match(/([^\/]+$)/)[0] : null;
    });
    console.log(reviewsURL);
    lastResponseData = await context.goto(reviewsURL + '/reviews', { timeout: 60000, waitUntil: 'load', checkBlocked: false });
    console.log('lastResponseData!!!!')
    console.log(lastResponseData)
    if (lastResponseData.status === 403) {
      return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
    }
    const run = async () => {
      // if (!await solveCaptchaIfNecessary) {
      //   hasCaptcha = true;
      //   return;
      // }
      await solveCaptchaIfNecessary();
    };

    await run();

    const secretKey = await context.evaluate(async function () {
      console.log('window!');
      console.log(window.state.user);
      return window.state.user.sk || window.state.user.secretKey;
    });
    const totalPagesReview = await context.evaluate(async function () {
      const data = document.querySelector('div[data-zone-name="productReviews"') ? document.querySelector('div[data-zone-name="productReviews"').getAttribute('data-zone-data') : null;
      console.log(data)
      const jsonData = JSON.parse(data);
      return jsonData.totalPageCount;
    });

    const path = await context.evaluate(async function () {
      return document.querySelector('link[rel="alternate"]') ? document.querySelector('link[rel="alternate"]').getAttribute('href').split('https://m.pokupki.market.yandex.ru')[1] : '';
    });

    let count = 0;
    let responseArr = [];

    console.log('totalPagesReview');

    console.log(totalPagesReview);

    while (count < totalPagesReview) {
    
      const results = await context.evaluate(async function (secretKey, productId, count, totalPagesReview, path) {
        const API = 'https://pokupki.market.yandex.ru/api/resolve/?r=beton/src/resolvers/reviews:resolveFullProductReviews';
        const options = {
          headers: {
            // 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            // 'x-requested-with': 'XMLHttpRequest',
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            pragma: 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            sk: secretKey,
          },
          // referrer: window.location.href,
          body: '{"params":[{"productId":'+productId+',"pager":{"pageNum":'+count+',"pageSize":9},"sort":{"by":"relevance","type":"desc"},"filter":{"gradeValue":null}}],"path":"'+path+'&marketSkuCreator=market"}',
          //body: `{"params":[{"productId":${productId},"pager":{"pageNum":${count},"pageSize":${totalPagesReview}},"sort":{"by":"relevance","type":"desc"},"filter":{"gradeValue":null}}],"path":"${path}&marketSkuCreator=market"}`,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        };
        const response = await fetch(API, options);
        console.log('response')
        console.log(response)
        if (response.status === 200) {
          const json = await response.json();
          // console.log(json);
          return json.results ? (json.results[0].data ? json.results[0].data.collections : null) : null;
        }
        return null;
      }, secretKey, productId, count, totalPagesReview);
      if (results) {
        responseArr.push(results);
      }
      count++;
    }

    // console.log('responseArr')

    // console.log(responseArr)

    // console.log('lengthresponseArr')

    // console.log(responseArr.length)

    let i = 0;
    while (i < responseArr.length) {
      let j = 0;
      // console.log('responseArr[i]op')
      // console.log(responseArr[i].review)
      // console.log(responseArr[i].review.length)
      const reviewsObj = (Object.entries(responseArr[i].review));
      const usersObj = (responseArr[i].user);
      console.log('usersObj')
      console.log(usersObj)
      while (j < reviewsObj.length) {
        const data = reviewsObj[j][1];
        const user = usersObj;
        await context.evaluate(async function (data, user) {
          console.log(data)
          console.log(user)
          function addHiddenDiv (data, user) {
            console.log()
            const upperDiv = document.createElement('div');
            upperDiv.setAttribute('class', 'iio_reviews');
            const newDiv = document.createElement('div');
            // newDiv.textContent = content;
            newDiv.setAttribute('data-reviewId', data.id);
            newDiv.setAttribute('data-reviewTitle', '');
            newDiv.setAttribute('data-reviewAuthor', data.userUid && user[data.userUid] ? user[data.userUid].displayName : '');
            newDiv.setAttribute('data-ratingScale', '5');
            newDiv.setAttribute('data-reviewRating', data.averageGrade);
            newDiv.setAttribute('data-reviewText', data.comment);
            newDiv.setAttribute('data-reviewDate', (new Date(Number(data.created)).toString()));
            newDiv.setAttribute('data-manufacturerResponse', '');
            newDiv.setAttribute('data-responseAuthor', '');
            upperDiv.style.display = 'none';
            upperDiv.append(newDiv);
            document.body.appendChild(upperDiv);
          }
          addHiddenDiv(data, user);
        }, data, user);
        j++;
      }
      i++;
    }

    return await context.extract(productReviews, { transform });
  },
};
