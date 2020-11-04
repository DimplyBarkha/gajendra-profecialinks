const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    transform,
    domain: 'ebag.bg',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('footer[class="page-footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[class="page-footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.waitForSelector('a[class=img-container]');
    } catch (error) {
      console.log('All images not loaded after scrolling!!');
    }
    async function addUrl (page) {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const searchUrl = window.location.href;
      const productCode = {}
      const query = decodeURI(window.location.href.match(/query=([^&]+)/) && window.location.href.match(/query=([^&]+)/)[1]);
      for (let counter = 0; counter <= page; counter++) {
        const response = await fetch(`https://www.ebag.bg/search/json?page=${counter}&query=${query}&brand=`, {
          accept: 'application/json, text/plain, */*',
          referrer: searchUrl,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response && response.status === 200) {
          const { data: { products } } = await response.json()
          for (const product of products) {
            productCode[product.id] = product.product_code
          }
        }
      }
      console.log('productCode', productCode)
      const productList = document.querySelectorAll('article.item');
      productList && productList.forEach((item1) => {
        const id = item1.querySelector('h2 a') ? item1.querySelector('h2 a').getAttribute('href')
          ? item1.querySelector('h2 a').getAttribute('href').replace(/.*\/(.*)/, '$1') : '' : ''
        const doc = item1;
        addElementToDocument(doc, 'added-searchurl', searchUrl);
        addElementToDocument(doc, 'added-productId', productCode[id] ? productCode[id] : '');
      });
    }


    async function paginate () {
      try {
        await context.evaluate(async () => {
          const element = document.querySelector('footer[class*="page-footer"]');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            console.log('**** Scrolling it *****')
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    let page = 0
    let length = await context.evaluate(async () => {
      return document.querySelectorAll('article[class*="item"]').length;
    });
    let oldLength = 0;
    while (length && length !== oldLength && length <= 10) {
      page++
      oldLength = length;
      await paginate();
      length = await context.evaluate(async () => {
        return document.querySelectorAll('article[class*="item"]').length;
      });
    }

    await context.evaluate(addUrl, page);
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
