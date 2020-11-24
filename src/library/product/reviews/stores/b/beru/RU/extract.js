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
    await context.evaluate(async function () {
      console.log('testing');
      // const showMore = document.querySelector
    });

    const scrollToContent = async (selector) => {
      await context.evaluate(async (selectorToScrollTo) => {
        function scrollToSmoothly (pos, time) {
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
                setTimeout(function () {
                  window.scrollTo(0, i);
                }, t / 2);
              }
              return resolve();
            } else {
              time = time || 100;
              var i = currentPos;
              var x;
              x = setInterval(function () {
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

    try {
      await scrollToContent('button[data-auto="show-more"]');
    } catch (err) {
      console.log('Product description is not found.');
    }
    const showMore = await context.evaluate(async function () {
      return !!document.querySelector('button[data-auto="show-more"]');
    });
    if (showMore) {
      await context.evaluate(async function () {
        document.querySelector('button[data-auto="show-more"]').click();
      });
      // await context.click('button[data-auto="show-more"]');
    }
    const secretKey = await context.evaluate(async function () {
      console.log('window!');
      console.log(window.state.user)
      return window.state.user.sk || window.state.user.secretKey;
    });
    await context.evaluate(async function () {
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
        body: '{"params":[{"productId":484051042,"pager":{"pageNum":1,"pageSize":9},"sort":{"by":"relevance","type":"desc"},"filter":{"gradeValue":null}}],"path":"/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market"}',
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      };
      const response = await fetch(API, options);
      const json = await response.json();
      console.log(json);
    });
    // fetch("https://pokupki.market.yandex.ru/api/resolve/?r=beton/src/resolvers/reviews:resolveFullProductReviews", {
    //   "headers": {
    //     "accept": "*/*",
    //     "accept-language": "en-US,en;q=0.9",
    //     "cache-control": "no-cache",
    //     "content-type": "application/json",
    //     "pragma": "no-cache",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "sk": "s64b02d16faa9b5d5c893d25cc6b8b098"
    //   },
    //   "referrer": "https://pokupki.market.yandex.ru/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market",
    //   "referrerPolicy": "unsafe-url",
    //   "body": "{\"params\":[{\"productId\":484051042,\"pager\":{\"pageNum\":5,\"pageSize\":9},\"sort\":{\"by\":\"relevance\",\"type\":\"desc\"},\"filter\":{\"gradeValue\":null}}],\"path\":\"/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market\"}",
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "include"
    // });
    return await context.extract(productReviews, { transform });
  },
};
// fetch("https://pokupki.market.yandex.ru/api/resolve/?r=beton/src/resolvers/reviews:resolveFullProductReviews", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "pragma": "no-cache",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "sk": "s6b95ab024733d2bd8ad16927ef26dbb6"
//   },
//   "referrer": "https://pokupki.market.yandex.ru/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market",
//   "referrerPolicy": "unsafe-url",
//   "body": "{\"params\":[{\"productId\":484051042,\"pager\":{\"pageNum\":1,\"pageSize\":9},\"sort\":{\"by\":\"relevance\",\"type\":\"desc\"},\"filter\":{\"gradeValue\":null}}],\"path\":\"/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
// fetch("https://pokupki.market.yandex.ru/api/resolve/?r=beton/src/resolvers/reviews:resolveFullProductReviews", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "pragma": "no-cache",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "sk": "s6b95ab024733d2bd8ad16927ef26dbb6",
//     "cookie": "yandexuid=1184122171589990231; yuidss=1184122171589990231; i=yMRug/pjGohKEXBs2bQG7U9HLitm2H/k6/N+4r2BIfTwVwGaktHa4XVv1+zuMaQ/BEtrpe13PNe3xFghdSJOnJGaFYM=; Cookie_check=checked; skid=2588212011606175244; acclinks=; visits=1606175244-1606175244-1606175244; reviews-merge=true; js=1; server_request_id_blue-market:index=1606175244952%2Ffd8015cccea491149324ecd0ceb40500; available-delivery=213%3D1; muid=1152921505032486181%3A4NeHeaNYTl%2BZ4m5ihRQyZ%2BlyEto9F6cw; ymex=1637711248.yrts.1606175248#1621526231.yrtsi.1589990231; fonts-loaded=1; ymp-onboarding-popup-was-shown=true; font-balloon-loaded=1; gdpr=0; _ym_uid=16061752471060328214; _ym_d=1606175260; _ym_uid=16061752471060328214; server_request_id_blue-market:product=1606175268232%2F31574b8f1d5fb9af0f5e4fd2ceb40500; parent_reqid_seq=1606175244189%2F36a01a3efdb7da13357ee0d0ceb40500%2C1606175244952%2Ffd8015cccea491149324ecd0ceb40500%2C1606175268232%2F31574b8f1d5fb9af0f5e4fd2ceb40500%2C1606175344385%2F92f58b135d949b1a845fd9d6ceb40500; server_request_id_blue-market:product-reviews=1606175344385%2F92f58b135d949b1a845fd9d6ceb40500"
//   },
//   "referrer": "https://pokupki.market.yandex.ru/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market",
//   "referrerPolicy": "unsafe-url",
//   "body": "{\"params\":[{\"productId\":484051042,\"pager\":{\"pageNum\":1,\"pageSize\":9},\"sort\":{\"by\":\"relevance\",\"type\":\"desc\"},\"filter\":{\"gradeValue\":null}}],\"path\":\"/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market\"}",
//   "method": "POST",
//   "mode": "cors"
// });
// curl 'https://pokupki.market.yandex.ru/api/resolve/?r=beton/src/resolvers/reviews:resolveFullProductReviews' \
//   -H 'Connection: keep-alive' \
//   -H 'Pragma: no-cache' \
//   -H 'Cache-Control: no-cache' \
//   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36' \
//   -H 'sk: s6b95ab024733d2bd8ad16927ef26dbb6' \
//   -H 'Content-Type: application/json' \
//   -H 'Accept: */*' \
//   -H 'Origin: https://pokupki.market.yandex.ru' \
//   -H 'Sec-Fetch-Site: same-origin' \
//   -H 'Sec-Fetch-Mode: cors' \
//   -H 'Sec-Fetch-Dest: empty' \
//   -H 'Referer: https://pokupki.market.yandex.ru/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market' \
//   -H 'Accept-Language: en-US,en;q=0.9' \
//   -H 'Cookie: yandexuid=1184122171589990231; yuidss=1184122171589990231; i=yMRug/pjGohKEXBs2bQG7U9HLitm2H/k6/N+4r2BIfTwVwGaktHa4XVv1+zuMaQ/BEtrpe13PNe3xFghdSJOnJGaFYM=; Cookie_check=checked; skid=2588212011606175244; acclinks=; visits=1606175244-1606175244-1606175244; reviews-merge=true; js=1; server_request_id_blue-market:index=1606175244952%2Ffd8015cccea491149324ecd0ceb40500; available-delivery=213%3D1; muid=1152921505032486181%3A4NeHeaNYTl%2BZ4m5ihRQyZ%2BlyEto9F6cw; ymex=1637711248.yrts.1606175248#1621526231.yrtsi.1589990231; fonts-loaded=1; ymp-onboarding-popup-was-shown=true; font-balloon-loaded=1; gdpr=0; _ym_uid=16061752471060328214; _ym_d=1606175260; _ym_uid=16061752471060328214; server_request_id_blue-market:product=1606175268232%2F31574b8f1d5fb9af0f5e4fd2ceb40500; parent_reqid_seq=1606175244189%2F36a01a3efdb7da13357ee0d0ceb40500%2C1606175244952%2Ffd8015cccea491149324ecd0ceb40500%2C1606175268232%2F31574b8f1d5fb9af0f5e4fd2ceb40500%2C1606175344385%2F92f58b135d949b1a845fd9d6ceb40500; server_request_id_blue-market:product-reviews=1606175344385%2F92f58b135d949b1a845fd9d6ceb40500' \
//   --data-binary '{"params":[{"productId":484051042,"pager":{"pageNum":1,"pageSize":9},"sort":{"by":"relevance","type":"desc"},"filter":{"gradeValue":null}}],"path":"/product/vesy-elektronnye-xiaomi-mi-body-composition-scale-2/484051042/reviews?show-uid=16061752444110212293006014&hid=90567&marketSkuCreator=market"}' \
//   --compressed
