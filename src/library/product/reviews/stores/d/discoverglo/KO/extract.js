const { transform } = require('./../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    transform,
    domain: 'discoverglo.co.kr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;

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
        if (document.querySelector('button#entrance')) {
          document.querySelector('button#entrance').click();
        }
      }
      // if (document.querySelector('li#showTab2')) {
      //   document.querySelector('li#showTab2 a').click();
      // }
    });

    await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });

    await context.evaluate(async function () {
      function addHiddenDiv (id, reviewData) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        newDiv.innerHTML = reviewData
      }

      const url = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      const page = Number(urlParams.get('page'));
      const reviewString = document.querySelector('div.review_topicon a span').textContent;
      const totalReviewsCount = Number(reviewString.replace(/,/g, ''));
      if (totalReviewsCount > 0 && page>0) {
        // const itemStr = url.match(/(\d+).html/g)[0].replace('.html', '');
        const itemStr = url.match(/(?<=--)(.*)(?=.html)/g)[0];
        const apiUrl = `https://www.discoverglo.co.kr/store/ajax.cmt.list.php?pdtIdx=${itemStr}&cmt2page=${page}`;
        console.log(`PAGE#:${page}`);
        console.log('itemStr#: ',itemStr);

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
    });

    return await context.extract(productReviews, { transform });
  },
};
