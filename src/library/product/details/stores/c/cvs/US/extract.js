const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    const linkURL = await context.evaluate(function () {
      const element = document.querySelector('div.css-1dbjc4n.r-18u37iz.r-tzz3ar a');
      const elementSelector = 'div.css-1dbjc4n.r-18u37iz.r-tzz3ar a'
      if (element) {
        // return element.href;
        return [elementSelector, element.href];
      } else {
        return null;
      }
    });

    // https://www.cvs.com/shop/american-crew-styling-gel-prodid-1013504
    // https://www.cvs.com/shop/american-crew-styling-gel-prodid-1013504

    if(linkURL === null) {
      throw new Error("notFound");
    }
    await context.click(linkURL[0])

    const urlTest = await context.evaluate(function(linkURL) {
      let currentUrl = window.location.href;
      let urlFromLink = linkURL[1]
      if(currentUrl === urlFromLink){
        return true;
      } else{
        return false
      }
    }, linkURL)
    if(!urlTest){
      await context.goto(linkURL[1], { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }

    await new Promise(resolve => setTimeout(resolve, 20000));

    await context.evaluate(function () {

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function collectNutritionInfo () {
        let i = 1;
        const termsWithValues = {};
        while (i < 200) {
          const nutrTerm = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(1) > div.css-901oao:nth-of-type(${i})`);
          const nutrValue = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(2) > div.css-901oao:nth-of-type(${i})`);
          if (nutrTerm && nutrValue) {
            termsWithValues[nutrTerm.innerHTML] = nutrValue.innerHTML;
          } else {
            break;
          }
          i++;
        }

        Object.keys(termsWithValues).forEach((term) => {
          console.log(term);
          addHiddenDiv(`ii_${term}`, termsWithValues[term]);
        });
      }

      function collectBrand () {
        const brandBlock = document.querySelector('script#schema-json-ld');

        if (brandBlock) {
          const brandObject = JSON.parse(brandBlock.innerText);
          addHiddenDiv('ii_Brand', `${brandObject[0].brand}`);
        }
      }

      function collectVariantId () {
        const variantId = window.location.href

        if (variantId) {
          const regex1 = /[0-9]+$/g;
          let varText = regex1.exec(variantId);
          if(varText){
          addHiddenDiv('ii_productCode', varText[0]);
          }
        }
      }

      addHiddenDiv('ii_url', window.location.href);
      collectNutritionInfo();
      collectBrand();
      collectVariantId()
    });
    

    async function variantClick () {
      const btns = await collectButtons();
      const waitSelector = 'div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)';
      const waitFor = 'div.css-1dbjc4n.r-16lk18l.r-11c0sde.r-1xi2sqm'
      let i = 0;
      let j = 0;

      if(btns[0].length){
        while(i < btns[0].length && i < 100) {
          await context.click(btns[0][i]);
          await context.click(btns[0][i]);
          let mCheck = await manufCheck()
          if(mCheck) {
            await new Promise(resolve => setTimeout(resolve, 20000));
          } else {
            await new Promise(resolve => setTimeout(resolve, 10000));
          }

          if(btns[1].length && j < 100){
            while(j < btns[1].length && j < 100) {
              let check = await buttonCheck(btns[1][j]);
              if(check) {
                await context.click(btns[1][j]);
                await context.click(btns[1][j]);
                if(mCheck) {
                  await new Promise(resolve => setTimeout(resolve, 20000));
                } else {
                  await new Promise(resolve => setTimeout(resolve, 10000));
                }
                await getVariantIdNum();
                await new Promise(resolve => setTimeout(resolve, 2000));
                await collectVariantInfo();
              }
              j++;
            }
            j = 0;
          } else {
            await getVariantIdNum();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await collectVariantInfo();
          }
          i++;
        }
      } else {
        const varStore = await context.evaluate(function () {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
          addHiddenDiv('ii_variantId');
        });
        await collectVariantInfo();
      }
    }

    async function manufCheck(selector) {
      return await context.evaluate(function(input) {
        let sel3 = '//div[@class="css-1dbjc4n r-13awgt0 r-1mlwlqe r-dnmrzs"]//div[contains(@id, "wc-power-page")]//text()'
        let sel2 = '//div[@class="css-1dbjc4n r-13awgt0 r-1mlwlqe r-dnmrzs"]//div[contains(@id, "wc-power-page")]//img'
        let sel1 = '//div[@class="css-1dbjc4n r-13awgt0 r-1mlwlqe r-dnmrzs"]//div[contains(@id, "wc-power-page")]//iframe'
        
        var element1 = document.evaluate( sel1, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var element2 = document.evaluate( sel2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var element3 = document.evaluate( sel3, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if( element1.snapshotLength > 0 || element2.snapshotLength > 0 || element3.snapshotLength > 0) {
          return true
        } else {
          return false
        }
          
      });
    }

    async function buttonCheck(selector) {
      let input = selector
      return await context.evaluate(function(input) {
        let sel = document.querySelector(input)
        if(sel) {
          // if(!sel.ariaLabel.includes("Out-of-stock")) {
          return true;
        } else {
          return false;
        }
        // }
      }, input);
    }

    

    async function getVariantIdNum(value) {
      let varArray = [];
      const varStore = await context.evaluate(function() {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
        
        let varPath = document.querySelector('div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)');
        const regex1 = /[0-9]+$/g;

        if (varPath) {
          const varText = regex1.exec(varPath.innerText);
          console.log(varText);
          if(varText){
            addHiddenDiv('ii_variantId', varText);
          }
        }
      });
    }



    async function collectButtons() {
      const moreCheck = await context.evaluate(function() {
        let selectorCheck = document.querySelector('div[aria-label="Toggle More/Less Swatches"] div.css-901oao.r-ty2z48');
        
        if(selectorCheck) {
          return true;
        } else {
          return false;
        }

      });
      const moreSelector = 'div[aria-label="Toggle More/Less Swatches"] div.css-901oao.r-ty2z48';
      if(moreCheck){
        await context.click(moreSelector);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }


      return await context.evaluate(function() {
        let flag = false;
        const selectors = [[], []];
        let i = 1;
        while(!flag && i < 40) {
          const firstVar = `div.css-1dbjc4n:nth-of-type(1) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(${i}) > div`;
          const secondVar = `div.css-1dbjc4n:nth-of-type(2) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(${i}) > div`;
          if(document.querySelector(firstVar)){
            selectors[0].push(firstVar);
          }
          if (document.querySelector(secondVar)) {
            selectors[1].push(secondVar);
          }
          if (!document.querySelector(firstVar) && !document.querySelector(secondVar)) {
            flag = true;
            break;
          }
          i++;
        }

        if (selectors.length) {
          return selectors;
        } else {
          return false;
        }
      });
    }

  async function collectVariantInfo (value) {
    const varStore = await context.evaluate(function() {

        function addHiddenDiv (id, content) {
          const variantId = document.querySelectorAll('div#ii_variantId');
          const variantDiv = variantId[variantId.length - 1];
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          if(variantDiv){
            variantDiv.appendChild(newDiv);
          }
        }
        function collectIframe() {
          const iframeList = document.querySelectorAll('iframe');
          if(iframeList) {
            iframeList.forEach((frame) => {
              const video = frame.contentDocument;
              if(!!video){
                let videoSrc = video.querySelector('video');
                if(videoSrc) {
                addHiddenDiv('ii_videoSrc', `${videoSrc.src}`);
                }
              }
            });
          }
        }
      const variantInfo = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao');
      // const variantImage = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz div.css-1dbjc4n.r-1pi2tsx img');
      const variantPrice = document.querySelector('div.css-901oao.r-cme181.r-1jn44m2.r-111xbm8.r-b88u0q');
      const variantRating = document.querySelector('div.css-1dbjc4n div.css-901oao.r-1enofrn.r-b88u0q.r-m2pi6t');
      const variantReview = document.querySelector('div.css-1dbjc4n.r-obd0qt.r-18u37iz a');
      const variantRatingText = document.querySelector('div.css-1dbjc4n.r-obd0qt.r-18u37iz section');
      const variantListPrice = document.querySelector('div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1wtj0ep.r-13qz1uu div.css-901oao.r-1khnkhu.r-1jn44m2.r-1b43r93.r-5fcqz0.r-m611by');
      const prodName = document.querySelector('h1.css-4rbku5.css-901oao.r-1jn44m2.r-1ui5ee8.r-vw2c0b.r-16krg75');
      const keyWordAdd = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao');
      const prodInfoLine = document.querySelector('div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)');
      // const manufDesc = document.querySelector('div#wc-power-page > div');
      const manufDesc = '//div[contains(@id, "wc-power-page")]//div[not (contains(., "Is the information in this section helpful")) and not (contains(., "The information above is")) and not (contains(., ".wc"))]//text()'
      const variantDescription = '(//div[@class="css-1dbjc4n r-13awgt0 r-1mlwlqe r-dnmrzs"]//div[@class="htmlView"])[1]//text()'
      const variantDescription2 = '(//div[@class="css-1dbjc4n r-13awgt0 r-1mlwlqe r-dnmrzs"]//div[@class="htmlView"])[1]//text()'
      const variantWarnings = '//div[@class="css-1dbjc4n r-13qz1uu"]//div[contains(.,"Warnings")]//div[@class="htmlView"]//text()'
      // const variantDirections = '//div[@class="css-1dbjc4n r-13qz1uu"]//div[contains(.,"Directions")]//div[@class="htmlView"]'
      // const variantDirections = '//div[@class="css-1dbjc4n r-13qz1uu"]//div[contains(.,"Directions")]//div[@class="htmlView"]//text()[not( contains(., "Questions?"))]'
      const variantDirections = '//div[@class="css-1dbjc4n r-13qz1uu"]//div[not(descendant-or-self::*[contains(@id,"wc")]) and contains(.,"Directions")]//div[@class="htmlView"]//text()[not( contains(., "Questions?"))]'
      const variantIngredients = '//div[@class="css-1dbjc4n r-13qz1uu"]//div[contains(.,"Ingredients") and not(contains(., "Details"))]//div[@class="htmlView"]'
      const variantADBI1 = '(//div[@class="css-1dbjc4n r-13qz1uu"]//div[contains(.,"Details")]//div[@class="htmlView"])[1]//li'
      const variantADBI2 = '//div[@class="css-1dbjc4n r-13awgt0 r-1mlwlqe r-dnmrzs"]//div[@class="htmlView"]/ul/li'
      // const variantAlternateImages = '(//div[contains(@id, "zoom-carousel")]//img[contains(@src,"https")])[position()>1]/@src'
      const variantAlternateImages = '(//div[contains(@id, "zoom-carousel")]//img[contains(@src,"https")])/@src'
      const variantManufImages = '//div[@id="wc-aplus"]//img/@src[not (contains(., "syndigo.svg"))]'
      // const variantDescriptionBullets = '//div[@class="htmlView"]/ul/li'
      const variantVideo = '//img[contains(@class,"wc-iframe")]/@data-asset-url'
      const variantVideo2 = '//img[contains(@class, "wc-video")]/@wcobj'
      const variantVideo3 = '//div[contains(@class, "wc-iframe")]//@data-src'
      const variantArray = [];
      const packSize = ['Pack: ', 'Group Size: '];
      const packSizeResult = [];
      for(let i = 0; i < 10; i = i + 2) {
        if (variantInfo[i + 1]) {
          if (packSize.includes(variantInfo[i].innerText)) {
            packSizeResult.push(variantInfo[i + 1].innerText);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantIngredients) {
        var element = document.evaluate( variantIngredients, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_variantIngredients`, `${element.snapshotItem(i).textContent}`);
          }
        }
      }
      if(manufDesc) {
        var element = document.evaluate( manufDesc, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_manufDesc`, `${element.snapshotItem(i).textContent}`);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantDirections) {
        var element = document.evaluate( variantDirections, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_variantDirections`, `${element.snapshotItem(i).textContent}`);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantWarnings) {
        var element = document.evaluate( variantWarnings, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_variantWarnings`, `${element.snapshotItem(i).textContent}`);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantVideo) {
        var element = document.evaluate( variantVideo, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var element2 = document.evaluate( variantVideo2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var element3 = document.evaluate( variantVideo3, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);


        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_videoSrc`, `${element.snapshotItem(i).textContent}`);
          }
        } 
        if(element2.snapshotLength > 0){
          for(let i = 0; i < element2.snapshotLength; i++) {
            addHiddenDiv(`ii_videoSrc`, `${element2.snapshotItem(i).textContent}`);
          }
        }
        if(element3.snapshotLength > 0){
          for(let i = 0; i < element3.snapshotLength; i++) {
            addHiddenDiv(`ii_videoSrc`, `${element3.snapshotItem(i).textContent}`);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantDescription) {
        var element = document.evaluate( variantDescription, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var element2 = document.evaluate( variantDescription2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_variantDescription`, `${element.snapshotItem(i).textContent}`);
          }
        } else if (variantDescription2){
          for(let i = 0; i < element2.snapshotLength; i++) {
            addHiddenDiv(`ii_variantDescription`, `${element2.snapshotItem(i).textContent}`);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantManufImages) {
        var element = document.evaluate( variantManufImages, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element.snapshotLength > 0 ) {
          for(let i = 0; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_variantManufImages`, `${element.snapshotItem(i).textContent}`);
          }
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantAlternateImages) {
        var element = document.evaluate( variantAlternateImages, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element.snapshotLength > 1 ) {
          for(let i = 1; i < element.snapshotLength; i++) {
            addHiddenDiv(`ii_variantAlternateImages`, `${element.snapshotItem(i).textContent}`);
          }
        }
        if( element.snapshotLength > 0 ) {
          addHiddenDiv('ii_variantImage', `${element.snapshotItem(0).textContent}`);
        } 
        if(element.snapshotLength > 1) {
          // debugger
          addHiddenDiv('ii_variantImageAlt', `${element.snapshotItem(1).textContent}`);
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantADBI1) {
        var element1 = document.evaluate( variantADBI1, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var element2 = document.evaluate( variantADBI2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if( element1.snapshotLength > 0 ) {
          let count = element1.snapshotLength;
          for(let i = 0; i < element1.snapshotLength; i++) {
            addHiddenDiv(`ii_variantADBI`, `${element1.snapshotItem(i).textContent}`);
          }
          addHiddenDiv(`ii_variantDescriptionBullets`, `${count}`);
        } else if(element2.snapshotLength > 0){
          let count = element2.snapshotLength;
          for(let i = 0; i < element2.snapshotLength; i++) {
            addHiddenDiv(`ii_variantADBI`, `${element2.snapshotItem(i).textContent}`);
          }
          addHiddenDiv(`ii_variantDescriptionBullets`, `${count}`);
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if (variantArray.length) {
        const variantString = variantArray.join(' || ');
        addHiddenDiv('ii_variantInfo', `${variantString}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if (packSizeResult.length) {
        const packString = packSizeResult.join(' ');
        addHiddenDiv('ii_packSize', `${packString}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

       if(variantPrice) {
        addHiddenDiv('ii_variantPrice', `${variantPrice.innerText}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      // if(variantAlternateImages) {
      //   var element = document.evaluate( variantAlternateImages, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      //   if( element.snapshotLength > 0 ) {
      //     addHiddenDiv('ii_variantImage', `${element.snapshotItem(0).textContent}`);
      //   } 
      //   if(element.snapshotLength > 0) {
      //     // debugger
      //     addHiddenDiv('ii_variantImageAlt', `${element.snapshotItem(0).textContent}`);
      //   }
      // }

      // if(variantImage){
      //   addHiddenDiv('ii_variantImage', `${variantImage[0].src}`);
      // }
      // if(variantImage){
      //   if(variantImage[1]){
      //     addHiddenDiv('ii_variantImageAlt', `${variantImage[1].src}`);
      //   }
      // }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantRating){
        addHiddenDiv('ii_variantRating', `${variantRating.innerText}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantReview){
        addHiddenDiv('ii_variantReview', `${variantReview.innerText}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(variantListPrice){
        addHiddenDiv('ii_variantListPrice', `${variantListPrice.innerText}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if (keyWordAdd[1] && prodName) {
        let varName = keyWordAdd[1].innerText;
        addHiddenDiv('ii_metaKeywords', `${prodName.innerText + " " + varName}`);
      } else if(prodName) {
        addHiddenDiv('ii_metaKeywords', `${prodName.innerText}`);
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if(prodInfoLine){
        addHiddenDiv('ii_grossWeight', `${prodInfoLine.innerText}`);
        addHiddenDiv('ii_quantity', `${prodInfoLine.innerText}`);
        const regex1 = /[0-9]+$/g;
        let skuText = regex1.exec(prodInfoLine.innerText);
        if(skuText) {
          addHiddenDiv('ii_sku', `${skuText[0]}`);
        }
      }
      new Promise(resolve => setTimeout(resolve, 1000));

      if (manufDesc) {
        addHiddenDiv('ii_manufDesc', `${manufDesc.innerText}`);
      }
    

      collectIframe()
    
    });
  }
  
  await variantClick()

    return await context.extract(productDetails, { transform: transformParam });
  },
};