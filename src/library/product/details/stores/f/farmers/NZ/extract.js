const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    transform: transform,
    domain: 'farmers.co.nz',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const imageEle = await context.evaluate(async () => {
      const imageEle = document.querySelectorAll('div#inpage_container img');
      return imageEle;
    });
    console.log('imageEle', imageEle);
    if (Object.keys(imageEle).length !== 0) {
      await context.waitForSelector('div#inpage_container img');
    }

    const productUrl = await context.evaluate(async () => {
      const url = window.location.href;
      return url;
    });

    const iframeSelector = 'div#inpage_container iframe, iframe#eky-dyson-iframe';
    try {
      await context.waitForSelector(iframeSelector, { timout: 30000 });
    } catch (error) {
      console.log('Can\'t load iframe.');
    }
    let newImages = null;
    let accessories = null;
    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return await Boolean(document.querySelector(currentSelector));
      }, selector);
    };
    if (await checkExistance(iframeSelector)) {
      await context.evaluate((iframeSelector) => {
        const ele = document.querySelector(iframeSelector);
        ele.scrollIntoView({ behavior: 'smooth' });
      }, iframeSelector);
      await new Promise((resolve, reject) => setTimeout(resolve, 7000));
      const iframeUrl = await context.evaluate((iframeSelector) => {
        return (document.querySelector(iframeSelector).getAttribute('src') || document.querySelector(iframeSelector).getAttribute('_src'));
      }, iframeSelector);
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      try {
        await context.waitForXPath('//img', { timout: 30000 });
      } catch (error) {
        console.log('Can\'t load iframe.');
      }
      const lateVideoElement = 'div[class*="video-container"] video';
      if (await checkExistance(lateVideoElement)) {
        await context.evaluate((lateVideoElement) => {
          const ele = document.querySelector(lateVideoElement);
          ele.scrollIntoView({ behavior: 'smooth' });
        }, lateVideoElement);
      }
      newImages = await context.evaluate(() => {
        const src = ele('img');
        function ele (tag) {
          return document.querySelectorAll(tag);
        }
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].src);
          }
        }
        return value;
      });
      try {
        await context.waitForSelector('div.eky-accesory-container', { timout: 30000 });
        await context.waitForSelector('div.eky-accessory', { timout: 30000 });
      } catch (error) {
        console.log('Can\'t load accessories.');
      }
      const accessoriesElement = 'div.eky-accesory-container div.eky-accessory';
      if (await checkExistance(accessoriesElement)) {
        await context.evaluate((accessoriesElement) => {
          const ele = document.querySelector(accessoriesElement);
          ele.scrollIntoView({ behavior: 'smooth' });
        }, accessoriesElement);
        await new Promise((resolve, reject) => setTimeout(resolve, 7000));
      }
      accessories = await context.evaluate(() => {
        function retrieve (nodeEle, isImg) {
          const element = document.querySelectorAll(nodeEle);
          const value = [];
          for (let i = 0; i < element.length; i++) {
            value.push(isImg ? element[i].src : element[i].innerText);
          }
          return value;
        }
        const imgSrcs = retrieve('div.eky-accesory-container div.eky-accessory img', true);
        const textArr = retrieve('div.eky-accesory-container div.eky-accessory div.eky-accesory-title', false);
        return { img: imgSrcs, text: textArr };
      });

      await context.goto(productUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

      try {
        if (!(await checkExistance('div#inpage_container div[class*="feature"] img'))) {
          console.log('still need to wait for manufacturerImages');
          await context.waitForSelector('div#inpage_container img');
        } else {
          console.log('the page seems to be loaded');
        }
      } catch (err) {
        console.log('this page seems to have no a-plus images or still is not loaded', err);
      }

      
    }
    console.log(newImages + ' are new images and product url is ' + productUrl);

    await context.evaluate(async (newImages, accessories) => {
      var src = '';
      // let iframeLink='';
      const imageEle = document.querySelectorAll('div#inpage_container img');
      const videoEle = document.querySelector('a.phone-thumb-overlay-YouTube');
      // const iframeEle=document.querySelector('div#inpage_container iframe');
      if (videoEle) {
        videoEle.click();
        src = document.querySelector('div.ish-product-photo iframe').getAttribute('src') || document.querySelector('div.ish-product-photo iframe').getAttribute('_src');
        if (src) {
          addHiddenDiv('video-url', src);
        }
      }

      if (newImages) {
        let str = '';
        for (let i = 0; i < newImages.length; i++) {
          if (i !== newImages.length - 2) {
            if (i !== newImages.length - 1) { str += newImages[i] + ' | '; }
          }
          if (i === newImages.length - 3) {
            str += newImages[i];
          }
        // addNewHiddenDiv(newImages[i]);
        // console.log(newImages[i]);
        }
        addNewHiddenDiv(str);
      }
      if (accessories) {
        const imagesAcc = accessories.img || [];
        const textAcc = accessories.text || [];
        addHiddenDiv('ii_accessImg', imagesAcc.join(' || '));
        addHiddenDiv('ii_accessText', textAcc.join(' || '));
      }
      // if(iframeEle){
      //   // iframeLink=iframeEle.getAttribute('src');
      //   let iWindow = iframeEle.contentWindow;
      //   iWindow.addEventListener("load", function() {
      //     // get the document from the window
      //     let doc = iframeEle.contentDocument || iframeEle.contentWindow.document;
      //     // find the target in the iframe content
      //     let target = doc.getElementById("img");
      //     target.innerHTML = "Found It!";
      // });
      //   // context.goto(src);
      // }

      // if(Object.keys(newImages).length !== 0){
      //   for(let i=0;i<newImages.length;i++)
      //     addHiddenDiv('manufacture-images', newImages[i]);
      // }
      if (Object.keys(imageEle).length !== 0) {
        var urls = [];
        imageEle.forEach((ele) => {
          var imageUrls = ele.getAttribute('data-flixsrcset');
          if (imageUrls && imageUrls.length > 0) {
            var str = imageUrls.split(',')[0].split(' ')[0];
            urls.push('https:' + str);
          };
        });
        if (urls.length > 0) {
          addHiddenDiv('manufacture-images', urls.join(','));
        }
      }
      var manufacturer = window.productDetails ? (JSON.parse(window.productDetails)).Manufacturer : '';
      if (manufacturer) {
        addHiddenDiv('manufacture-name', manufacturer);
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addNewHiddenDiv (imageUrl) {
        const newDiv2 = document.createElement('div');
        newDiv2.setAttribute('class', 'extra-manufacturer-images');
        newDiv2.textContent = imageUrl;
        newDiv2.style.display = 'none';
        document.body.appendChild(newDiv2);
      }
    }, newImages, accessories);
    return await context.extract(productDetails, { transform });
  },
};
