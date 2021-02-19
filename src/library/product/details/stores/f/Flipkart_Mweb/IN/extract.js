const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const GetTagByIdUsingRegex = (tag, id, html) => {
      // eslint-disable-next-line no-useless-escape
      return new RegExp('<' + tag + '[^>]*id[\\s]?=[\\s]?[\'"]' + id + '[\'"][\\s\\S]*?<\/' + tag + '>').exec(html);
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await fetch(window.location.href, {
      method: 'GET',
    }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', 'is_script', htm);
      const outerHTML = result && result[0] ? result[0] : '';

      document.body.insertAdjacentHTML('beforeend', outerHTML);
    });

    const readMoreBtn = document.querySelector('button[class*="_2KpZ6l _1FH0tX"]');
    if (readMoreBtn) {
      // @ts-ignore
      readMoreBtn.click();
      console.log('read more button clicked');
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    }
    const manufactureBtn = document.querySelector('div._1JDTUN');
    if (manufactureBtn) {
      // @ts-ignore
      manufactureBtn.click();
      console.log('manufacturer button clicked');
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    }

    const descButton = document.querySelector('div._2eaE_9');
    if (descButton) {
      // @ts-ignore
      descButton.click();
      console.log('description button clicked');
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    }

    function addEleToDoc (node, key, value) {
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      node.appendChild(prodEle);
    }

    document.querySelectorAll('div.col._3I4OjY > ul >li').forEach(man => {
      // man.parentElement = man.innerText
      var manText = man.innerText;

      // console.log(manText)
      addEleToDoc(man, 'manufacturer', manText);
    });

    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    if (document.body.querySelector('#is_script')) {
      const JSstring = document.body.querySelector('#is_script') ? document.body.querySelector('#is_script').innerHTML : '';
      const obj = JSON.parse(JSstring.split('window.__INITIAL_STATE__ = ').slice(-1)[0].trim().slice(0, -1));
      const mediaObject = obj.pageDataV4.page.data[10001]['0'].widget.data.multimediaComponents;
      if (mediaObject.hasOwnProperty(1)) {
        for (var i = 1; i <= mediaObject.length; i++) {
          if (mediaObject[i] !== undefined) {
            if (mediaObject[i].value.contentType === 'VIDEO') {
              var videoUrl = mediaObject[i].value.url;
              addElementToDocument('videoUrl', videoUrl);
            }
          }
        }
      }

      const imageFromThumbnails = document.querySelectorAll('li[class*=\'_4f8Q22 _2y_FdK\'] div div').length ? document.querySelectorAll('li[class*=\'_4f8Q22 _2y_FdK\'] div div')[0].getAttribute('style') : '';
      if (imageFromThumbnails) {
        const imageFromThumbnailsTransformed = imageFromThumbnails.substr(21, imageFromThumbnails.length - 22).replace('/128/128/', '/832/832/'); ;
        addElementToDocument('thumbnailsMainImage', imageFromThumbnailsTransformed);
      } else {
        // eslint-disable-next-line no-prototype-builtins
        if (mediaObject.hasOwnProperty(0)) {
          if (mediaObject[0].value.contentType === 'IMAGE') {
            const imageUrl = mediaObject[0].value.url.replace('{@width}/{@height}', '832/832').replace('{@quality}', '70');
            addElementToDocument('imageUrl', imageUrl);
          }
        }
      }
    }

    const url = window.location.href;
    // addElementToDocument('variantId', url);
    const regx = /(pid=([0-9a-zA-Z]+))/g;
    const match = regx.exec(url);
    // console.log(match[2])
    addElementToDocument('variantId', match[2]);
    const pageurl = url.substring(url.lastIndexOf('m/') + 1);

    const fetchURL = `https://www.flipkart.com/api/4/page/fetch?prefetchKey=PRODUCTPAGE_${pageurl}&cacheFirst=false`;
    console.log('fetchURL: ', fetchURL);
    const response = await fetch(fetchURL, {
      headers: {
        'content-type': 'application/json',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-user-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36 FKUA/msite/0.0.1/ucweb/Mobile',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `{\"pageUri\":\"${pageurl}\"}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });

    if (response && response.status === 400) {
      throw new Error('Error when calling API');
    }

    if (response && response.status === 404) {
      console.log('Product Not Found!!!!');
    }

    if (response && response.status === 200) {
      console.log('Product Found!!!!');
      const data = await response.json();
      const pagedata = data.RESPONSE.pageData.pageContext;
      if (pagedata) {
        const brand = pagedata.brand;
        if (brand) {
          addElementToDocument('brandText', brand);
        }
        if (pagedata.trackingDataV2) {
          addElementToDocument('sellername', pagedata.trackingDataV2.sellerName);
          console.log(pagedata.trackingDataV2.sellerName);
        }
      }
    }

    var a = document.querySelectorAll('div._3k-BhJ table');
    if (a != null) {
      var b = '';
      for (let i = 0; i < a.length; i++) {
        // b = b + a[i].innerText + " ";
        var parent = a[i].parentNode;
        // @ts-ignore
        b = b + parent.innerText + '||';
      }
      var spec = b.replace(/\n/g, ' ');
      addElementToDocument('spec', spec);
    }

    var qantity = getElementByXpath('//*[contains(text(),"Quantity")]/following-sibling::td/ul/li/text()');
    if (qantity) {
      addElementToDocument('quantity', qantity.textContent);
    } else {
      const quat = getElementByXpath("//div[@id='container']/div/div/div/div/div[@class='_1AtVbE col-12-12'][1]/div/div[1]/h1/span");
      if (quat) {
        const regx = /(\d*\.?\d+)\s?(ml|g|kg|L)/gi;
        const match = regx.exec(quat.textContent);
        if (match) {
          addElementToDocument('quantity', match[1] + ' ' + match[2]);
        }
      }
    }

    var high = document.querySelectorAll('li._21Ahn-');
    var des1 = document.querySelector('div._2o-xpa');
    var finald = '';
    if (high) {
      if (high.length != 0) {
        for (let i = 0; i < high.length; i++) {
          if (i != high.length - 1) {
            // @ts-ignore
            finald = finald + high[i].innerText + '||';
          } else {
            // @ts-ignore
            finald = finald + high[i].innerText;
          }
        }
      }
    }

    if (des1 != null) {
      if (high.length != 0) {
        // @ts-ignore
        finald += ' || ' + des1.innerText;
      } else {
        finald += des1.innerText;
      }
    }
    addElementToDocument('adddesc', finald);

    var enhanceContent = '';
    var a = document.querySelectorAll('div._3qWObK');

    if (a.length != 0) {
      for (let i = 0; i < a.length; i++) {
        // b = b + a[i].innerText + " ";
        var parent = a[i].parentNode;
        if (i != a.length - 1) {
          enhanceContent += parent.innerText + ' ';
        } else { enhanceContent += parent.innerText; }
      }
    }
    var MaDesc = enhanceContent.replace(/\n/g, ' ');
    addElementToDocument('MaDesc', MaDesc);

    // fetch(`https://www.flipkart.com/api/4/page/fetch?prefetchKey=PRODUCTPAGE_${pageurl}&cacheFirst=false`, {
    //   "headers": {
    //     "content-type": "application/json",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "x-user-agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36 FKUA/msite/0.0.1/ucweb/Mobile"
    //   },
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body": `{\"pageUri\":\"${pageurl}\"}`,
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "include"
    // })
    // .then(response => response.json())
    // .then(page => {

    // });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'Flipkart_Mweb',
    transform: cleanUp,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
