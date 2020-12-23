const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    transform,
    domain: 'eprice.it',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const specsArrSelector = document.querySelectorAll('div#anchorTech ul li');
      if (specsArrSelector) {
        const specsArr = [];
        for (let i = 0; i < specsArrSelector.length; i++) {
          specsArr.push(specsArrSelector[i].querySelector('span:nth-child(1)').innerText + ': ' + specsArrSelector[i].querySelector('span:nth-child(2)').innerText);
          addHiddenDiv('specsArr', specsArr[i]);
        }
      }
    });
    async function getSponsredAds () {
      const widgets = 'product_page_w1';
      const storeHash = '72b96307e81bca4348dd3992d936169a6cc4fcb7bcf91c81b90047eb69857ce9';
      const pageType = 'PRODUCT_SERVING';
      const productSiteId = products[0].sku;
      const signals = pageViewData.page_catList.split('|').map(elm => `signals=${elm.trim()}`).join('&').replace(/-/g, ' ');
      const url = window.location.origin + window.location.pathname;
      const callback = ' ';
      const API = `https://eu.widget.mb-srv.com/serve/ad.jsonp?widgets=${widgets}&storeHash=${storeHash}&pageType=${pageType}&productSiteId=${productSiteId}&${signals}&url=${url}&callback=${callback}`;
      const response = await fetch(API);
      const data = await response.text();
      const htmls = JSON.parse(data.trim().replace(/^\(|\)$/g, '')).payload.ads.map(elm => elm.html);
      for (const html of htmls) {
        const sponsored = document.createElement('div');
        sponsored.setAttribute('class', 'sponsored-products');
        sponsored.innerHTML = html;
        document.body.append(sponsored);
      }
    }
    try {
      await context.evaluate(getSponsredAds);
    } catch (error) {
      console.log('Error adding sponsored products');
    }
    return await context.extract(productDetails, { transform });
  },
};
