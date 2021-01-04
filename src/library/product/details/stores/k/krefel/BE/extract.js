const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    transform: cleanUp,
    domain: 'krefel.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const needToSelectLanguage = await context.evaluate(() => {
      return !!document.querySelector('a[class*="select-language"]');
    });

    if (needToSelectLanguage) {
      const urlSuffix = await context.evaluate(() => {
        const currentUrl = window.location.href;
        const filter = new RegExp('(?=\/p)(.*)');
        return currentUrl.match(filter)[0]
      });
      // https://www.krefel.be/nl/p/21004082-elektrische-tandenborstel-stages-power
      await context.goto(`https://www.krefel.be/nl${urlSuffix}`, { timeout: 20000, waitUntil: 'load' });
    }

    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const accCookie = document.querySelector('section.cookie-alert div.button-section a');
      if (accCookie) accCookie.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));

      const scriptWithInfo = document.evaluate("//script[contains(text(), 'availability')]", document, null, XPathResult.STRING_TYPE, null);
      const regexAvailability = /"availability":\s"([A-z]+)"/g;
      const regexRating = /"ratingValue":\s"([\d,]+)"/g;
      const foundAvailability = regexAvailability.exec(scriptWithInfo.stringValue);
      const foundRatingValue = regexRating.exec(scriptWithInfo.stringValue);
      if (foundAvailability && foundAvailability[1] === 'InStock') {
        addElementToDocument('availability', 'In Stock');
      } else addElementToDocument('availability', 'Out of Stock');
      if (foundRatingValue) {
        addElementToDocument('ratingValue', foundRatingValue[1]);
      }

      const price = document.querySelector('div.product-info span.current-price.orange.nl')
        ? document.querySelector('div.product-info span.current-price.orange.nl').innerText : '';
      if (price) {
        addElementToDocument('price', `€ ${price.replace(/\.|\s/g, '')}`);
      }

      const variantInfo = document.querySelector('select.product-variant-select option[selected]')
        ? document.querySelector('select.product-variant-select option[selected]').innerText : '';
      if (variantInfo) {
        addElementToDocument('variantInfo', variantInfo);
      }

      const pdfExists = document.evaluate('//div[@class="description-wrap"]//a/@href[contains(.,"pdf") or contains(.,"PDF")]', document, null, XPathResult.STRING_TYPE, null);
      if (pdfExists && pdfExists.stringValue) addElementToDocument('pdfExists', 'Yes');
      const specifications = document.querySelectorAll('div.block-header, div.specs-overview li');

      const specArr = [];
      if (specifications.length) {
        specifications.forEach((e) => {
          specArr.push(e.innerText.replace(/\n/g, ' '));
        });
      }

      addElementToDocument('specifications', specArr.join(' || '));
      const description = document.querySelector('section.description div.description-wrap')
        ? document.querySelector('section.description div.description-wrap').innerText.replace(/•/g, '||').replace(/\s{2,}/g, ' ') : '';
      addElementToDocument('description', description);

      const warrantyXpath = document.evaluate('//div[@class="description-wrap"]//*[contains(text(),"garantie")]', document, null, XPathResult.STRING_TYPE, null);
      const warranty = warrantyXpath ? warrantyXpath.stringValue : '';
      if (warranty) addElementToDocument('warranty', warranty);

      const promotionText = document.querySelector('div.product-info .promotion-wrap > span') ? document.querySelector('div.product-info .promotion-wrap > span').innerText : '';
      if (promotionText) addElementToDocument('promotionText', promotionText);

      let videosText = document.querySelector('div.autheos-videothumbnail img') ? document.querySelector('div.autheos-videothumbnail img').getAttribute('src') : '';
      if (videosText) {
        const index = videosText.indexOf('thumb');
        if (videosText.includes('generic')) {
          videosText = videosText.slice(0, index - 1);
        } else {
          videosText = videosText.slice(0, index);
          videosText += 'high.mp4';
        }
        addElementToDocument('videosText', videosText);
      }
    });

    await context.click('a[href*="brand-info"]', { timeout: 7000 })
      .catch(() => console.log('No extra brand info'));

      // await context.click('a.brand-content-link', { timeout: 30000 })
      // .catch(() => console.log('No brand-content'));

      
      const link = await context.evaluate(function () {
        return window.location.href;
      });
    
      const src = await context.evaluate(async function () {
        const accCookie = document.querySelector('a.brand-content-link');
      if (accCookie) accCookie.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 30000));
        const iframe = document.querySelector('div #loadbeeIframeId');
        // const src = iframe ? (iframe.src||iframe._src) : '';
        let src = '';
        if (iframe) {
          if (iframe.hasAttribute('src')) {
            src = iframe.getAttribute('src');
          } else if (iframe.hasAttribute('_src')) {
            src = iframe.getAttribute('_src');
          } else {
            console.log('we do not have any src in iframe');
          }
        } else {
          console.log('we do not have the iframe');
          const inBoxText = [];
          const getInTheBoxTextOnly = document.querySelector('div #product-specifications');
          const intheboxppresent = document.querySelector('div#brand-info');
          if(getInTheBoxTextOnly && !intheboxppresent){
            const getAllProductsTextOnly = document.evaluate('//h4[contains(text(),"Meegeleverde accessoires")]/..//following-sibling::div//li//span[@class="value"]//*[name()="svg" and not(contains(@class,"cross-red"))]/../../../span[@class="name"] |  //h4[contains(text(),"Meegeleverde accessoires")]/..//following-sibling::div//li//span[@class="value"]/span/span/../../../span[@class="name" and not (contains(text(),"Extra accessoires")) and not (contains(text(),"Overige accessoires")) and not (contains(text(),"Type oplader")) and not (contains(text(),"In de doos"))]|//h4[contains(text(),"Meegeleverde accessoires")]/..//following-sibling::div//li//span[@class="name"]/span/span|//h4[contains(text(),"Meegeleverde accessoires")]/ancestor::div[1]//following-sibling::div//li//span[contains(text(),"Type oplader") or contains(text(),"In de doos") or contains(text(),"Overige accessoires")or contains(text(),"Extra accessoires")]/ancestor::li//span[@class="value"]', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            
            let description = [];
            try {
              var thisNode = getAllProductsTextOnly.iterateNext();
            
              while (thisNode) {
                description.push( thisNode.textContent );
                console.log("description",description);
                thisNode = getAllProductsTextOnly.iterateNext();
              }
            }
            catch (e) {
              alert( 'Error: Document tree modified during iteration ' + e );
            }
                   
              addHiddenDiv('inTheBoxText', description);          
        
          }
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
          for (let i = 0; i < inBoxText.length; i++) {
            if (inBoxText[i]) {
              addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
            }
          }
        }
        console.log('iframe src to go to - ' + src);
    
        return src;
      });
      // let content = null;
      if (src) {
        try {
          await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
          const witbData = await context.evaluate(async () => {
            const getInTheBox = document.querySelector('div.in-the-box>div.side-pics');
            const getInTheBoxVideo = document.querySelector('div.in-the-box>div.main-pic');
            const getInTheBoxComparison = document.querySelector('h1.next-chapter.compare-headline');
           
            const inBoxUrls = [];
            const inBoxText = [];
            const inComparison =[];
            if(getInTheBoxVideo){
              const getAllProductsVideo = document.querySelectorAll('div.in-the-box>div.main-pic');
              for (let i = 0; i < getAllProductsVideo.length; i++) {
                inBoxUrls.push(getAllProductsVideo[i].querySelector('img').getAttribute('src'));
                inBoxText.push(getAllProductsVideo[i].querySelector('p>b').innerText);
              }
            }
            if (getInTheBox) {
              const getAllProducts = document.querySelectorAll('div.in-the-box>div.side-pics>div.item');
              for (let i = 0; i < getAllProducts.length; i++) {
                inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute('src'));
                inBoxText.push(getAllProducts[i].querySelector('p>b').innerText);
              }
            }
            if(getInTheBoxComparison){
              const getAllProductsComparison = document.querySelectorAll('h1.next-chapter.compare-headline');
              for (let i = 0; i < getAllProductsComparison.length; i++) {
                inComparison.push(getAllProductsComparison[i].innerText);
              }
            }
            return { inBoxText, inBoxUrls, inComparison };
          });
         
    
          await context.goto(link, { timeout: 15000 });
          await context.waitForSelector('div.page-content', { timeout: 5000 });
        
          await context.evaluate(async (witbData) => {
            function addHiddenDiv (id, content) {
              const newDiv = document.createElement('div');
              newDiv.id = id;
              newDiv.textContent = content;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
    
            const { inBoxText = [], inBoxUrls = [], inComparison=[] } = witbData;
            for (let i = 0; i < inBoxUrls.length; i++) {
              addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
               if (inBoxText[i]) {
                addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
              }
              if(inComparison[i]){
                addHiddenDiv(`hasComparisonTable-${i}`, inComparison[i]);
              }
            }

          }, witbData);
          // await context.waitForSelector('div#main-section', { timeout: 45000 });
        } catch (error) {
          try {
            await context.evaluate(async function (src) {
              window.location.assign(src);
            }, src);
            await context.waitForSelector('div.page-content');
            return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
          } catch (err) {
            console.log(err);
          }
        }
        // return await context.extract(productDetails, { transform });
      } else {
        console.log('we do not have the src for iframe');
        
      }
    

    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    return await context.extract(productDetails, { transform });
  },
};
