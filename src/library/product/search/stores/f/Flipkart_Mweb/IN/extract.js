const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 30000) {
        await stall(1500);
        scrollTop += 2000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
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
  };
  await applyScroll(context);

  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };
    // const thumb = document.querySelectorAll('div._13oc-S > div > div > a > div > div > div.CXW8mj > img');
    // console.log(thumb);

    const GetTagByIdUsingRegex = (tag, id, html) => {
      return new RegExp('<' + tag + "[^>]*id[\\s]?=[\\s]?['\"]" + id + "['\"][\\s\\S]*?</" + tag + '>').exec(html);
    };

    const searchUrl = window.location.href;
    document.querySelectorAll('div._4ddWXP').forEach(product => {
      addElementToDocument(product, 'searchUrl', searchUrl);
    });

    await fetch(window.location.href, { method: 'GET' }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', 'is_script', htm);
      const outerHTML = result && result[0] ? result[0] : '';
      const JSstring = JSON.parse(outerHTML.split('window.__INITIAL_STATE__ = ')[1].split(';</script>')[0]);
      const widgets = JSstring.pageDataV4.page.data[10003];
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const productSelectors = document.querySelectorAll('div._13oc-S>div');
      console.log(productSelectors.length);
      console.log(widgets);
      for (let i = 0; i < productSelectors.length; i++) {
        addElementToDocument(productSelectors[i], 'rankOrganic', `${lastProductPosition + i}`);
        const id = document.querySelectorAll('div._13oc-S>div')[i] ? document.querySelectorAll('div._13oc-S>div')[i].getAttribute('data-id') : '';
        // const avgRating = document.querySelectorAll('div > div.gUuXy-._2D5lwg >span > div')[i];
        // const urlData = document.querySelectorAll('a._31qSD5')[i] ? document.querySelectorAll('a._31qSD5')[i].href : document.querySelectorAll('a.Zhf2z-')[i].href;
        // document.querySelectorAll('div._3O0U0u>div')[i].setAttribute('producturl', `${urlData}`);

        // if(avgRating.innerText!==null | avgRating.innerText!=='')
        // {
        //   console.log(avgRating.innerText);
        // }

        for (let j = 1; j < widgets.length; j++) {
          stall(20000);
          if (widgets[j].widget.data.products && widgets[j].widget.data.products.length) {
            for (let k = 0; k < widgets[j].widget.data.products.length; k++) {
              const productId = widgets[j].widget.data.products[k].productInfo.value.id;
              const reviewCount = widgets[j].widget.data.products[k].productInfo.value.rating.reviewCount;
              const ratingAvg = widgets[j].widget.data.products[k].productInfo.value.rating.average;
              const imageUrl = widgets[j].widget.data.products[k].productInfo.value.media.images[0].url;
              const image = imageUrl.replace(/\{@width\}|\{@height\}/g, '312').replace(/\{@quality\}/g, '70');
              const regx = /(pid=([0-9a-zA-Z]+))/g;
              const match = regx.exec(widgets[j].widget.data.products[k].productInfo.value.baseUrl);
              if (id === match[2] || id === productId) {
                // console.log(productBrand);
                addElementToDocument(productSelectors[i], 'image', image);
                addElementToDocument(productSelectors[i], 'reviewCount', reviewCount);
                addElementToDocument(productSelectors[i], 'ratingAvg', ratingAvg);
              }
            }
          }
        }
      }
    });
    stall(1500);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'Flipkart_Mweb',
    transform: transform,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
