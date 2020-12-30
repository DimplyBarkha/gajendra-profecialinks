const { cleanUp } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: cleanUp,
    domain: 'coolblue.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `added-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }
      // Get all variant combinations
      function cartesian (...args) {
        const r = [];
        const max = args.length - 1;
        function helper (arr, i) {
          for (let j = 0, l = args[i].length; j < l; j++) {
            const a = arr.slice(0);
            a.push(args[i][j]);
            if (i === max) r.push(a.join(' '));
            else helper(a, i + 1);
          }
        }
        helper([], 0);
        return r;
      }

      const getXpath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      };

      const data = {};
      // let availabilityText = document.querySelector('div[data-multi-discriminant-preview-availability-state]')
      //   ? document.querySelector('div[data-multi-discriminant-preview-availability-state]').textContent : '';
      // if (!availabilityText) {
      //   availabilityText = document.querySelector('meta[itemprop="availability"] ~ div h2')
      //     ? document.querySelector('meta[itemprop="availability"] ~ div h2').textContent : '';
      // }
      // if (availabilityText) data.availability = availabilityText;
      // else data.availability = document.querySelector('div.product-order form button.button--order') ? 'In Stock' : 'Out of Stock';
      const ratingNode = getXpath('//div[contains(@class,"product-page--title-links")]//span[contains(@class,"review-rating__reviews")]');
      if (ratingNode) {
        data.ratingCount = ratingNode.textContent.match(/(\d+) reviews/) ? ratingNode.textContent.match(/(\d+) reviews/)[1] : '0';
        const ratingString = ratingNode.textContent.match(/(\d(.\d)?)\/10/)
          ? ratingNode.textContent.match(/(\d(.\d)?)\/10/)[1].replace(',', '.') : '';
        if (ratingString) data.aggregateRating = (parseFloat(ratingString) / 2).toString().replace('.', ',');
      }
      // @ts-ignore
      data.warranty = [...document.querySelectorAll('dl[data-property-name*=Garantie] dd')].map(el => el.innerText).join(' ');
      // @ts-ignore
      const variantTypes = [...document.querySelectorAll('div[class*=js-multi-discriminant-field]')].map(el => {
        return el.querySelector('strong').innerText.match(/:$/) ? el.querySelector('strong').innerText : `${el.querySelector('strong').innerText}:`;
      });
      // @ts-ignore
      const variantArrays = [...document.querySelectorAll('div[class*=js-multi-discriminant-field] + div')].map((el, index) => {
        return [...el.querySelectorAll('input')].map(elm => variantTypes[index] + elm.getAttribute('data-value-name'));
      });
      // @ts-ignore
      const dropdownVariants = [...document.querySelectorAll('div.collection-entrance__dropdown div.collection-entrance-card')].map(el => {
        return el.querySelector('strong').innerText;
      });
      let variants = [];
      if (variantArrays.length) variants = cartesian(...variantArrays);
      else if (dropdownVariants.length) variants = dropdownVariants;
      data.variants = variants;
      data.variantsCount = variants.length;
      appendData(data);
      let altImages = '';
      if (document.querySelector("div[class*='media-gallery-thumbnails'] button")){
        document.querySelector("div[class*='media-gallery-thumbnails'] button").click();
        let securls=[...document.querySelectorAll(".product-media-gallery-thumbnails ul li:nth-child(n+2) img")];
        let secimages=[];
        for( let i=0; i<securls.length;i++){
          let imagesrc = securls[i].getAttribute('src');
          imagesrc = imagesrc.replace(/(.+\/)(\d+x\d+)(.+)/,'$1500x500$3');
          if (imagesrc.includes('content')){
            continue;
          }
          secimages.push(imagesrc);
        }
        let uniqueImages = [...new Set(secimages)];
        altImages = uniqueImages.join(' | ');
        console.log('HELLO SEE HERE',secimages);
        document.body.setAttribute('alt-image',altImages);
      }
      else{
        let securls=[...document.querySelectorAll(".product-media-gallery-thumbnails ul li:nth-child(n+2) img")];
        let secimages=[];
        for( let i=0; i<securls.length;i++){
          let imagesrc = securls[i].getAttribute('src');
          imagesrc = imagesrc.replace(/(.+\/)(\d+x\d+)(.+)/,'$1500x500$3');
          if (imagesrc.includes('content')){
            continue;
          }
          secimages.push(imagesrc);
        }
        let uniqueImages = [...new Set(secimages)];
        altImages = uniqueImages.join(' | ');
        console.log('HELLO SEE HERE',secimages);
        document.body.setAttribute('alt-image',altImages);
      }
    });
      try {
        const currentUrl = await context.evaluate(() => {
          return window.location.href;
        });
        const iframeUrl = await context.evaluate(() => {
          const result = document.querySelector('#view-in-store a');
          if (result) {
            return document.querySelector('#view-in-store a').getAttribute('href');
          }
        });
        if (iframeUrl) {
          await context.goto(iframeUrl, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: true });
          await context.waitForSelector('div[class*="grid-unit"] img');
          const images = await context.evaluate(() => {
            // @ts-ignore
            const images = [...document.querySelectorAll("div[class*='grid-unit'] img[src*='content']")];
            let text = '';
            images.forEach(image => {
              const imageSrc = image.attributes.src.value;
              text = text + (text ? ' | ' : '') + imageSrc;
            });
            return text;
          });
          console.log("Images",images);
          const description = await context.evaluate(() => {
            // @ts-ignore
            const descs = [...document.querySelectorAll('div[id*="id"]')];
            let text = '';
            descs.forEach(desc => {
              
              text = text + (text ? ' ' : '') + desc.innerText;
            });
            return text;
          });
          console.log("description", description);
          await context.goto(currentUrl, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: true });
          const variables = {img:images,desc:description};
          await context.evaluate((variables) => {
          document.body.setAttribute('enchanced-content',variables.desc);
          document.body.setAttribute('iplus-image',variables.img);
          },variables); 
      }
      } catch (e) {
        console.log(e);
      } 

    
    await context.extract(productDetails, { transform });
  },
};
