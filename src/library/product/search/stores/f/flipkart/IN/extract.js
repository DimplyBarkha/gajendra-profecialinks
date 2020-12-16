//const { transform } = require('../../../../shared');
const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  //const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 80000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 80000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms)
      {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  //await context.waitForXPath('//div[@class="E2-pcE _1q8tSL"]//div[@class="CXW8mj"]/img/@src[(contains(.,".jpeg?q=70"))]');
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    //const url = window.location.href.replace(/%20/g, ' ');
    //addHiddenDiv('added-searchurl', url);

    function stall (ms){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };

    const GetTagByIdUsingRegex = (tag, id, html) => {
      return new RegExp('<' + tag + "[^>]*id[\\s]?=[\\s]?['\"]" + id + "['\"][\\s\\S]*?</" + tag + '>').exec(html);
    };

    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    await stall(20000);

    const itemContainers = document.querySelectorAll('div._4ddWXP');
    const itemContainers1 = document.querySelectorAll('div._2kHMtA');
    let rank = 1;
    if (itemContainers){
      for (const itemContainer of itemContainers) {
        // console.log(itemContainer);
        const totalRank = itemContainer + rank;
        addElementToDocument(itemContainer, 'rank', totalRank);
        rank++;
      }
    }
    else if(itemContainers1){
      for (const itemContainer of itemContainers1) {
        // console.log(itemContainer);
        const totalRank = itemContainer + rank;
        addElementToDocument(itemContainer, 'rank', totalRank);
        rank++;
      }
    }

    await fetch(window.location.href, { method: 'GET' }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', 'is_script', htm);
      const outerHTML = result && result[0] ? result[0] : '';
      console.log(outerHTML);
      const JSstring = JSON.parse(outerHTML.split('window.__INITIAL_STATE__ = ')[1].split(';</script>')[0]);
      const widgets = JSstring.pageDataV4.page.data[10003];
      //const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const productSelectors = document.querySelectorAll('div._13oc-S>div');
      const url = window.location.href;
      console.log(productSelectors.length);
      console.log(widgets);
      for (let i = 0; i < productSelectors.length; i++) {
        addElementToDocument(productSelectors[i], 'rankOrganic', i+1);//`${lastProductPosition + i}`);
        addElementToDocument(productSelectors[i], 'url', url);
        const id = document.querySelectorAll('div._13oc-S>div')[i] ? document.querySelectorAll('div._13oc-S>div')[i].getAttribute('data-id') : '';



        //const url1 = document.querySelectorAll('div._13oc-S>div > div._4ddWXP > a._2rpwqI')[i] ? document.querySelectorAll('div._13oc-S>div > div._4ddWXP > a._2rpwqI')[i].getAttribute('href') : '';
        
        
        
        
        for (let j = 1; j < widgets.length; j++) {
            stall(20000);
          if (widgets[j].widget.data.products && widgets[j].widget.data.products.length) {
            for (let k = 0; k < widgets[j].widget.data.products.length; k++) {
              const productId = widgets[j].widget.data.products[k].productInfo.value.id;

              //const producturl = widgets[j].widget.data.products[k].productInfo.action.url;


              const regx = /(pid=([0-9a-zA-Z]+))/g;
              const match = regx.exec(widgets[j].widget.data.products[k].productInfo.value.baseUrl);      
              if (id === match[2] || id === productId)/* || producturl === url1) */{
                const reviewCount = widgets[j].widget.data.products[k].productInfo.value.rating.reviewCount;
                const ratingAvg = widgets[j].widget.data.products[k].productInfo.value.rating.average
                const imageUrl = widgets[j].widget.data.products[k].productInfo.value.media.images[0].url;
                const image = imageUrl.replace(/\{@width\}|\{@height\}/g, '312').replace(/\{@quality\}/g, '70');
                addElementToDocument(productSelectors[i], 'image', image);
                addElementToDocument(productSelectors[i], 'review', reviewCount);
                addElementToDocument(productSelectors[i], 'rating', ratingAvg);
              }
            }
          }
        }
      }
      //localStorage.setItem('prodCount', $productSelectors.length);//`${lastProductPosition + productSelectors.length}`);
    });
   stall(1500);

  });
  return await context.extract(productDetails, { transform: parameters.transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};