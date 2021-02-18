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
    var page1 = document.querySelector('#container > div > div._3LxdjL._3NzWOH > div._3FqKqJ > div > div:nth-child(2) > div:nth-child(2) > div > div > div > a.s1Q9rs');
    if (page1) {
      page1.click();
    }
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const producturl = window.location.href;
    addElementToDocument('added-producturl', producturl);

    function getElementByXpaths (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    const url = window.location.href;
    // addElementToDocument('variantId', url);
    const regx = /(pid=([0-9a-zA-Z]+))/g;
    const match = regx.exec(url);
    // console.log(match[2])
    addElementToDocument('pid', match[2]);

    const GetTagByIdUsingRegex = (tag, id, html) => {
      // eslint-disable-next-line no-useless-escape
      return new RegExp('<' + tag + '[^>]*id[\\s]?=[\\s]?[\'"]' + id + '[\'"][\\s\\S]*?<\/' + tag + '>').exec(html);
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await fetch(window.location.href, {
      method: 'GET',
    }).then(r => r.text()).then(htm => {
      if (getElementByXpaths("//div[@id='container']/div/div/div/div/div[@class='_1AtVbE col-12-12'][1]/div/div[1]/h1/span/text()")) {
        console.log('resulttt');
        const result = GetTagByIdUsingRegex('script', 'is_script', htm);
        const outerHTML = result && result[0] ? result[0] : '';

        document.body.insertAdjacentHTML('beforeend', outerHTML);
      }
    });
    const readButton3 = document.getElementsByTagName('button');
    // console.log(readButton);
    for (const itemContainer of readButton3) {
      console.log(itemContainer);
      // addHiddenDiv(itemContainer, 'rank', totalRank);
      console.log('errorrrrrrrrrrrrrrrrrr');
      if (itemContainer && itemContainer.textContent === 'View all features') {
        itemContainer.click();
        // console.log("itemContainer");
      }
    }

    const readButton = document.getElementsByTagName('button');
    console.log(readButton);
    for (const itemContainer of readButton) {
      console.log(itemContainer);
      // addHiddenDiv(itemContainer, 'rank', totalRank);
      if (itemContainer && itemContainer.textContent === 'Read More') {
        itemContainer.click();
        // console.log("itemContainer");
      }
    }

    const readButton1 = document.getElementsByTagName('div');
    for (const itemContainer of readButton1) {
      console.log(itemContainer);
      // addHiddenDiv(itemContainer, 'rank', totalRank);
      if (itemContainer && itemContainer.textContent === 'Manufacturing, Packaging and Import Info') {
        itemContainer.click();
        // console.log("itemContainer");
        var manuf = document.querySelector('#container > div > div._2wQ56C._1h3i_z > div > div > div.row._1CPgaO > span');
        console.log(manuf, '#####################################');
        console.log('new');
      }
    }
    var Manufacturing1 = document.querySelectorAll('div.col._3I4OjY > ul > li');
    var finaldM = '';
    if (Manufacturing1 != null) {
      for (let i = 0; i < Manufacturing1.length; i++) {
        if (i != Manufacturing1.length - 1) {
          // @ts-ignore
          finaldM = finaldM + Manufacturing1[i].innerText + ',';
        } else {
          // @ts-ignore
          finaldM = finaldM + Manufacturing1[i].innerText;
        }
      }
    }
    addElementToDocument('manuf', finaldM);
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };

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
        const imageFromThumbnailsTransformed = imageFromThumbnails.substr(21, imageFromThumbnails.length - 22).replace('/128/128/', '/416/416/'); ;
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
    const ratingCountExists = document.evaluate('//span[@class=\'_38sUEc\']//*[contains(text(), \'Reviews\') or contains(text(), \'reviews\')]', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
    if (ratingCountExists) {
      const ratingCountString = document.evaluate('//span[@class=\'_38sUEc\']//*[contains(text(), \'Reviews\') or contains(text(), \'reviews\')]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const ratingCountRegexp = /(\d+)\s+(Reviews|reviews)/g;
      const ratingCountMatch = ratingCountRegexp.exec(ratingCountString)[1];
      addElementToDocument('ratingCount', ratingCountMatch);
    }

    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    if (getElementByXpath("//span[@class='B_NuCI']")) {
      const getbrand = getElementByXpath('//td[not(contains(text(),"Brand Color")) and contains(text(),"Brand")]/following-sibling::*[1]');
      const brand1 = getElementByXpath("//span[@class='G6XhRU']");
      const getname = getElementByXpath("//span[@class='B_NuCI']");
      var jsonData1 = document.getElementById('jsonLD');
      if (getbrand != null && getbrand != undefined) {
        addElementToDocument('brand', getbrand.textContent);
      } else if (brand1 != null && brand1 != undefined) {
        addElementToDocument('brand', brand1.textContent);
      } else if (jsonData1) {
        var jsonData = JSON.parse(document.getElementById('jsonLD').innerHTML);
        if (jsonData[0]) {
          if ('brand' in jsonData[0]) {
            const brandText = jsonData[0].brand.name;
            if (brandText) { addElementToDocument('brand', brandText); }
          } else if (getname != null && getname != undefined) {
            var brand = getname.textContent.split(' ')[0];
            if (brand != null && brand != undefined) {
              addElementToDocument('brand', brand);
            }
          }
        } else if (getname != null && getname != undefined) {
          var brand = getname.textContent.split(' ')[0];
          if (brand != null && brand != undefined) {
            addElementToDocument('brand', brand);
          }
        }
      } else if (getname != null && getname != undefined) {
        var brand = getname.textContent.split(' ')[0];
        addElementToDocument('brand', brand);
      }
    }

    var high = document.querySelectorAll('li._21Ahn-');
    var des1 = document.querySelector('div._2o-xpa');
    var finald = '';
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
    if (des1 != null) {
      if (high.length != 0) {
        // @ts-ignore
        finald += ' || ' + des1.innerText;
      } else {
        finald += des1.innerText;
      }
    }
    addElementToDocument('desc', finald);

    var Descrip1 = document.querySelector('div._1GoqrO');
    var enhanceContent = '';
    var a = document.querySelectorAll('div._3qWObK');
    if (Descrip1 != null) {
      enhanceContent += Descrip1.innerText;
    }
    if (a.length != 0) {
      for (let i = 0; i < a.length; i++) {
      // b = b + a[i].innerText + " ";
        var parent = a[i].parentNode;
        if (i != a.length - 1) {
          enhanceContent += parent.innerText + '|';
        } else { enhanceContent += parent.innerText; }
      }
    }
    var MaDesc = enhanceContent.replace(/\n/g, ' ');
    addElementToDocument('MaDesc', MaDesc);

    var a = document.querySelectorAll('div._3k-BhJ table');
    if (a != null) {
      var b = '';
      for (let i = 0; i < a.length; i++) {
      // b = b + a[i].innerText + " ";
        var parent = a[i].parentNode;
        // @ts-ignore
        b = b + parent.innerText + ' ';
      }
      var spec = b.replace(/\n/g, ' ');
      addElementToDocument('spec', spec);
    }

    var ratingcount1 = document.querySelector('div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div > div div.row._3AjFsn._2c2kV- > div > div > div.col-3-12 > div > div:nth-child(3) > div > span');
    // if(ratingcount1!=null && ratingcount1!=undefined){
    addElementToDocument('ratingcount1', ratingcount1);
    // }
    const defaultVariantCount = 0;
    addElementToDocument('variantCount', defaultVariantCount);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: cleanUp,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
