
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(200);
    const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
    if (link != null) {
      link.click();
    }
  });

  await context.waitForXPath("//div[@data-test='product-price']");

  const currentUrl = await context.evaluate(function() {
    return window.location.href;
  });

  if(currentUrl.indexOf('preselect=') > -1) {
    let productId = currentUrl.split('preselect=')[1];
    productId = productId.split('#')[0];
    const splitUrl = currentUrl.split('-');
    splitUrl[splitUrl.length - 1] = productId;
    await context.goto(splitUrl.join('-'));
    await context.waitForXPath("//div[@data-test='product-price']");
  }

  await context.evaluate(async function () {
    location.reload();
  });
  await context.waitForXPath("//div[@data-test='product-price']");

  let variantProductCount = await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(200);
      scrollTop += 500;
      if (scrollTop === 8000) {
        break;
      }
    }
    window.scroll(0, 300);

    await stall(100);
    const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
    if (manufacturerCTA) {
      manufacturerCTA.click();
    }
    await stall(200);
    const element = document.querySelector('#salsify-ec-iframe');
    if (element) {
      console.log('found iframe');
      console.log(element.getAttribute('src'));
      await fetch(element.getAttribute('src'))
        .then(async function (response) {
          const sometext = await response.text();
          const startText = '<body>';
          const endText = '</body>';
          const startIx = sometext.indexOf(startText);
          const endIx = sometext.indexOf(endText, startIx);
          console.log('start: ' + startIx);
          console.log('end: ' + endIx);
          const bodyContent = sometext.substring(startIx + startText.length, endIx);
          const wrapper = document.createElement('div');
          wrapper.id = 'frameContents';
          wrapper.innerHTML = bodyContent;
          document.body.appendChild(wrapper);
          console.log('tried to append iframe content');
        });
    } else {
      console.log('did not find iframe');
    }

    if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
      if (!document.getElementById('options')) {
        document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
      }
      await stall(250);
      const options = document.getElementById('options');
      const newDiv = document.createElement('div');
      newDiv.id = 'btnIndex';
      newDiv.textContent = -1;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      if (options.querySelectorAll('a').length) {
        options.querySelectorAll('a')[0].click();
      }
      return options.querySelectorAll('a').length;
    }
    let variantProductBtns = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
    if (!variantProductBtns.length) {
      variantProductBtns = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
    }
    if (variantProductBtns.length) {
      const newDiv = document.createElement('div');
      newDiv.id = 'btnIndex';
      newDiv.textContent = -1;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      variantProductBtns[0].click();
      return variantProductBtns.length;
    }
    return 0;
  });
  console.log('variations', variantProductCount);
  if (variantProductCount === 0) {
    variantProductCount = 1;
  }

  const extractedData = [];
  for (let i = 0; i < variantProductCount; i++) {
    const canContinue = await context.evaluate(async function () {
      if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
        if (!document.getElementById('options')) {
          document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
        }
        const options = document.getElementById('options');
        console.log('options', options.querySelectorAll('a'));
        if (document.getElementById('btnIndex') && options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1]) {
          return true;
        }
      }
      let variants = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
      if (!variants.length) {
        variants = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
      }
      if (variants.length && document.getElementById('btnIndex') && !variants[parseInt(document.getElementById('btnIndex').innerHTML) + 1]) {
        return false;
      }
      return true;
    });

    if (!canContinue) {
      break;
    }

    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addHiddenDiv (id, content) {
        if (document && document.getElementById(id)) {
          document.getElementById(id).innerHTML = content;
          return;
        }
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function validTextField (e) {
        return e && e.innerText && e.parentElement && e.parentElement.innerText;
      }

      let extendedText = '';
      if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
        if (!document.getElementById('options')) {
          document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
        }
        const options = document.getElementById('options');
        if (document.getElementById('btnIndex') && options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1].getAttribute('aria-label')) {
          addHiddenDiv('colorInfo', options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1].getAttribute('aria-label').split('-')[0].replace('color', '').trim());
        } else if (document.getElementById('btnIndex') && options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1]) {
          addHiddenDiv('colorInfo', options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1].innerText.trim());
        }
        if (document.getElementById('btnIndex')) {
          options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1].click();
        }
      } else {
        let variants = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
        if (variants.length) {
          if (variants[parseInt(document.getElementById('btnIndex').innerHTML) + 1].innerText) {
            extendedText = variants[parseInt(document.getElementById('btnIndex').innerHTML) + 1].innerText.replace(/\r?\n|\r/g, '').trim();
          }
        }
        if (!variants.length) {
          variants = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
        }
        if (variants.length && document.getElementById('btnIndex')) {
          variants[parseInt(document.getElementById('btnIndex').innerHTML) + 1].click();
        }
        if (document.querySelector('div[data-test="variationTheme-color"]') && document.querySelector('div[data-test="variationTheme-color"]').innerText) {
          addHiddenDiv('colorInfo', document.querySelector('div[data-test="variationTheme-color"]').innerText.replace('color', '').trim());
        }
      }

      window.scroll(0, 0);

      addHiddenDiv('dateStamp', new Date());
      addHiddenDiv('urlInfo', window.location.href);
      if (document.querySelector('h1[data-test="product-title"]') && document.querySelector('h1[data-test="product-title"]').innerText) {
        addHiddenDiv('productName', document.querySelector('h1[data-test="product-title"]').innerText.replace(/\r?\n|\r/g, '').trim());
      }
      if (document.querySelector('h1[data-test="product-title"]') && document.querySelector('h1[data-test="product-title"]').innerText) {
        addHiddenDiv('productNameExtended', document.querySelector('h1[data-test="product-title"]').innerText.replace(/\r?\n|\r/g, '') + ' ' + extendedText);
      }

      const desc = [];
      let descCount = 0;
      if(document.querySelector('a[href="#tabContent-tab-Details"]')) {
        document.querySelector('a[href="#tabContent-tab-Details"]').click();
        await stall(200);
      }
      document.querySelectorAll('h3').forEach(e => {
        if (e && e.innerText === 'Highlights') {
          e.parentElement.querySelectorAll('li').forEach(li => {
            descCount++;
            if (li) {
              desc.push(li.innerText);
            }
          });
        }
      });
      document.querySelectorAll('h3').forEach(e => {
        if (e && e.parentElement && e.parentElement.querySelector('.h-margin-v-default') && e.innerText === 'Description') {
          desc.push(e.parentElement.querySelector('.h-margin-v-default').innerText);
        }
      });

      addHiddenDiv('bulletCount', descCount);
      addHiddenDiv('description', '|| ' + desc.join(' || '));

      const subCategories = [];
      const categoryDiv = document.querySelector('.h-text-sm.h-padding-v-tiny');
      categoryDiv.querySelectorAll('a').forEach(e => {
        subCategories.push(e.getAttribute('aria-label'));
      });
      addHiddenDiv('subCategories', subCategories.join(' > '));

      if (document.querySelector('span[data-test="product-savings"]') && document.querySelector('span[data-test="product-savings"]').innerText) {
        addHiddenDiv('regPriceInfo', document.querySelector('span[data-test="product-savings"]').innerText.split(' ')[1]);
      } else if (document.querySelector('div[data-test="product-price"]')) {
        addHiddenDiv('regPriceInfo', document.querySelector('div[data-test="product-price"]').innerText);
      }

      const materials = [];
      let quantity = 1;
      document.querySelector('a[href="#tabContent-tab-Details"]').click();
      if (document && document.querySelectorAll('b').length) {
        document.querySelectorAll('b').forEach(e => {
          if (validTextField(e) && (e.innerText.indexOf('UPC') > -1)) {
            addHiddenDiv('upcInfo', e.parentElement.innerText.replace('UPC: ', ''));
          }
          if (validTextField(e) && (e.innerText.indexOf('TCIN') > -1)) {
            addHiddenDiv('skuInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && (e.innerText.indexOf('Item Number (DPCI)') === 0)) {
            addHiddenDiv('variantIdInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && (e.innerText.indexOf('Contains:') === 0)) {
            addHiddenDiv('allergyAdviceInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && (e.innerText.indexOf('Weight:') > -1 || e.innerText.indexOf('Net weight:') > -1)) {
            addHiddenDiv('weightInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && e.innerText.indexOf('Warranty') > -1) {
            addHiddenDiv('warrantyInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && e.innerText.indexOf('State of Readiness:') > -1) {
            addHiddenDiv('storageInfo', e.parentElement.innerText);
          }
          if (validTextField(e) && e.innerText.indexOf('Dimensions') > -1) {
            addHiddenDiv('dimensionsInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && e.innerText.indexOf('p65warning') > -1) {
            addHiddenDiv('p65Info', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && e.innerText.indexOf('Quantity:') > -1) {
            quantity = e.innerText.split(':')[1];
          }
          if (validTextField(e) && e.innerText.indexOf('Number of') > -1) {
            addHiddenDiv('packSize', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && e.innerText.indexOf('Suggested Age:') > -1) {
            addHiddenDiv('ageInfo', e.parentElement.innerText.replace('Suggested Age: ', '').trim());
          }
          if (validTextField(e) && e.innerText.indexOf('Alcohol content:') > -1) {
            addHiddenDiv('alcoholInfo', e.parentElement.innerText.replace('Alcohol content: ', ''));
          }
          if (validTextField(e) && (e.innerText.indexOf('Material:') > -1 || e.innerText.indexOf('material:') > -1)) {
            const split = e.parentElement.innerText.split(':');
            materials.push(split[split.length - 1]);
          }
          if (validTextField(e) && e.innerText.indexOf('Net weight:') > -1) {
            addHiddenDiv('weightInfo', e.parentElement.innerText.replace('Net weight: ', ''));
          }
          if (validTextField(e) && (e.innerText.indexOf('WARNING:') > -1 || e.innerText.indexOf('warning') > -1)) {
            addHiddenDiv('warningInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (validTextField(e) && e.innerText.indexOf('Disclaimer:') > -1) {
            addHiddenDiv('disclaimerInfo', e.parentElement.innerText.split(':')[1]);
          }
        });
      }
      if (materials.length) {
        addHiddenDiv('materialInfo', materials.join(', '));
      }
      addHiddenDiv('quantityInfo', quantity);

      const additionalInfo = [];
      document.querySelectorAll('.Col-favj32-0.RDgXb.h-padding-t-tight.h-padding-r-default').forEach(e => {
        if (e) {
          additionalInfo.push(e.innerText);
        }
      });
      addHiddenDiv('additionalInfo', additionalInfo.join(', '));

      const button = document.querySelector('#tab-ShippingReturns');
      if (button != null) {
        button.click();
        if (document && document.querySelector('div[data-test="shippingOptionsMessage"]')) {
          addHiddenDiv('shippingInfo', document.querySelector('div[data-test="shippingOptionsMessage"]').innerText);
        }

        if (document && document.querySelector('div[data-test="estimatedShipDimensions"]')) {
          addHiddenDiv('shipDimensionsInfo', document.querySelector('div[data-test="estimatedShipDimensions"]').innerText.replace('Estimated ship dimensions: ', ''));
        }

        if (document && document.querySelector('div[data-test="estimatedShipWeight"]')) {
          addHiddenDiv('shipWeightInfo', document.querySelector('div[data-test="estimatedShipWeight"]').innerText.replace('Estimated ship weight: ', ''));
        }
      }
    });

    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      function addHiddenDiv (id, content) {
        if (document && document.getElementById(id)) {
          document.getElementById(id).innerHTML = content;
          return;
        }
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function validTextField (e) {
        return e && e.innerText && e.parentElement && e.parentElement.innerText;
      }

      const zoom = document.querySelector('.ZoomedImage__Zoomed-sc-1j8d1oa-0.dwtKdC');
      if (zoom) {
        addHiddenDiv('zoomInfo', 'Yes');
      } else {
        addHiddenDiv('zoomInfo', 'No');
      }

      const rotate = document.querySelector('button[data-test="button-model-viewer"]');
      if (rotate) {
        addHiddenDiv('rotateInfo', 'Yes');
      } else {
        addHiddenDiv('rotateInfo', 'No');
      }

      const button = document.querySelector("a[href='#tabContent-tab-Labelinfo']");
      if (button != null) {
        button.click();
        await stall(1000);
        const headerEls = document.querySelectorAll('.h-margin-t-default.h-padding-h-default');
        for (const e of headerEls) {
          if (validTextField(e) && e.innerText.indexOf('Ingredients:') > -1) {
            addHiddenDiv('ingredientsInfo', e.innerText.replace('Ingredients:', '').trim().toUpperCase());
            break;
          }
        }
        document.querySelectorAll('p').forEach(e => {
          if (validTextField(e) && e.innerText.indexOf('Serving Size:') > -1) {
            addHiddenDiv('servingSizeInfo', e.innerText.replace('Serving Size: ', ''));
            if (document.getElementById('servingSizeInfo')) {
              const splitInfo = document.getElementById('servingSizeInfo').innerHTML.split(' ');
              addHiddenDiv('servingSizeUomInfo', splitInfo[splitInfo.length - 1]);
            }
          }
          if (validTextField(e) && e.innerText.indexOf('Serving Per Container:') > -1) {
            addHiddenDiv('servingPerContainerInfo', e.innerText.replace('Serving Per Container: ', '').replace(/[a-zA-Z]/g, ''));
          }
        });
        document.querySelectorAll('.h-text-bold').forEach(e => {
          if (validTextField(e) && e.innerText.indexOf('Calories:') > -1) {
            addHiddenDiv('caloriesInfo', e.parentElement.innerText.replace('Calories: ', ''));
          }
          if (validTextField(e) && e.innerText.indexOf('Calories from Fat:') > -1) {
            addHiddenDiv('caloriesFromFatInfo', e.parentElement.innerText.replace('Calories from Fat: ', ''));
          }
        });
        document.querySelectorAll('.h-margin-t-tight').forEach(e => {
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Total Fat') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('totalFatInfo', val.replace(/\D/g, ''));
            addHiddenDiv('totalFatUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Saturated Fat') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('saturatedFatInfo', val.replace(/\D/g, ''));
            addHiddenDiv('saturatedFatUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Trans Fat') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('transFatInfo', val.replace(/\D/g, ''));
            addHiddenDiv('transFatUomInfo',val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Cholesterol') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('cholesterolInfo', val.replace(/\D/g, ''));
            addHiddenDiv('cholesterolUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Sodium') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('sodiumInfo', val.replace(/\D/g, ''));
            addHiddenDiv('sodiumUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Total Carbohydrate') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('totalCarbInfo', val.replace(/\D/g, ''));
            addHiddenDiv('totalCarbUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Dietary Fiber') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('dietaryFiberInfo', val.replace(/\D/g, ''));
            addHiddenDiv('dietaryFiberUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && (e.innerText.indexOf('Total Sugars') > -1 || e.innerText.indexOf('Sugars') === 0)) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('totalSugarInfo', val.replace(/\D/g, ''));
            addHiddenDiv('totalSugarUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Protein') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('proteinInfo', val.replace(/\D/g, ''));
            addHiddenDiv('proteinUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Vitamin A') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('vitaminAInfo', val.replace(/\D/g, ''));
            addHiddenDiv('vitaminAUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Vitamin C') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('vitaminCInfo', val.replace(/\D/g, ''));
            addHiddenDiv('vitaminCUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Calcium') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('calciumInfo', val.replace(/\D/g, ''));
            addHiddenDiv('calciumUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Iron') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('ironInfo', val.replace(/\D/g, ''));
            addHiddenDiv('ironUomInfo', val.replace(/[0-9]/g, ''));
          }
          if (validTextField(e) && e.querySelector('span') && e.innerText.indexOf('Magnesium') > -1) {
            const split = e.querySelector('span').innerText.split(' ');
            const val = split[split.length - 1];
            addHiddenDiv('magInfo', val.replace(/\D/g, ''));
            addHiddenDiv('magUomInfo', val.replace(/[0-9]/g, ''));
          }
        });
      }
      const drugFacts = document.querySelector('a[href="#tabContent-tab-Drugfacts"]');
      if (drugFacts) {
        drugFacts.click();
        await stall(100);
        const warning = [];
        document.querySelectorAll('h4').forEach(e => {
          if (validTextField(e) && e.innerText.trim() === 'Directions') {
            addHiddenDiv('directionsInfo', e.parentElement.innerText.replace('Directions', '').trim());
          }
          if (validTextField(e) && e.innerText.trim() === 'Inactive ingredients') {
            addHiddenDiv('ingredientsInfo', e.parentElement.innerText.replace('Inactive ingredients', '').trim().toUpperCase());
          }
          if (validTextField(e) && (e.innerText.trim() === 'For use' || e.innerText.trim() === 'Keep out of reach' || e.innerText.trim() === 'Do not use' || e.innerText.trim() === 'When using')) {
            warning.push(e.innerText.trim());
            warning.push(e.parentElement.innerText.replace(e.innerText.trim(), '').trim());
          }
        });
        if (warning.length) {
          addHiddenDiv('warningInfo', warning.join(' '));
        }
      }

      let terms = 'No';
      if (document && document.querySelector('a[href="/c/terms-conditions/-/N-4sr7l"]')) {
        terms = 'Yes';
      }
      addHiddenDiv('terms', terms);

      let privacy = 'No';
      if (document && document.querySelector('a[href="/c/target-privacy-policy/-/N-4sr7p"]')) {
        privacy = 'Yes';
      }
      addHiddenDiv('privacy', privacy);
      addHiddenDiv('customerServiceAvailability', 'Yes');

      let variants = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
      if (!variants.length) {
        variants = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
      }
      if (variants.length) {
        variants.forEach(e => {
          if (e && e.getAttribute('aria-label').indexOf('checked') > -1 && e.innerText) {
            addHiddenDiv('variantInfo', e.innerText);
          }
        });
      }

      let deliver = false;
      let inStore = false;
      const inStoreOnlyMessage = document.querySelector('div[data-test="inStoreOnlyMessage"]') || document.querySelector('div[data-test="orderPickupMessage"]');
      if(inStoreOnlyMessage && (inStoreOnlyMessage.querySelector('.h-text-greenDark.h-text-bold') || inStoreOnlyMessage.querySelector('.h-text-orangeDark.h-text-bold'))) {
        addHiddenDiv('inStorePrice', document.querySelector('div[data-test="product-price"]').innerText);
        inStore = true;
      }

      const orderMessage = document.querySelector('div[data-test="deliverToZipCodeMessage"]');
      if(orderMessage && (orderMessage.querySelector('.h-text-greenDark.h-text-bold') || orderMessage.querySelector('.h-text-orangeDark.h-text-bold'))) {
        deliver = true;
      }

      if (deliver) {
        addHiddenDiv('availability', 'In Stock');
      } else if (inStore) {
        addHiddenDiv('availability', 'In Store Only');
      }
      if (!deliver && !inStore) {
        addHiddenDiv('availability', 'Out of stock');
      }

      const secondaryImages = [];
      const videos = [];
      const moreImageBtn = document.querySelector('.styles__LegendGridButtonOverlay-beej2j-13');
      if (moreImageBtn) {
        moreImageBtn.click();
        const slideDeck = document.querySelector('.ZoomedSlideDeck__SlideList-sc-1nqe9sx-0');
        if (slideDeck) {
          console.log('has slide deck');
          slideDeck.querySelectorAll('.ZoomedSlide__Image-sc-10kwhw6-0').forEach(async (e, ind) => {
            if (e && e.getAttribute('alt') && e.getAttribute('src') && e.getAttribute('alt').indexOf('- video') === -1 && ind > 0) {
              secondaryImages.push(e.getAttribute('src').split('?')[0]);
            } else if (e && e.getAttribute('src') && e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) {
              videos.push(e.getAttribute('src').split('?')[0] + '_Flash9_Autox720p_2600k');
            }
          });
        }
      } else {
        const sideImages = document.querySelectorAll('.styles__ThumbnailImage-beej2j-11');
        if (sideImages) {
          sideImages.forEach((e, ind) => {
            if (e && e.getAttribute('type') && e.getAttribute('src') && e.getAttribute('type').indexOf('video') === -1 && ind > 0) {
              secondaryImages.push(e.getAttribute('src').split('?')[0]);
            } else if (e && e.getAttribute('alt') && e.getAttribute('src') && e.getAttribute('alt').indexOf('- video') > -1) {
              videos.push(e.getAttribute('src').split('?')[0] + '_Flash9_Autox720p_2600k');
            }
          });
        }
      }
      if (secondaryImages.length) {
        addHiddenDiv('secondaryImages', secondaryImages.join(' | '));
      }
      if (document.querySelectorAll('.styles__ThumbnailImage-beej2j-11').length && document.querySelectorAll('.styles__ThumbnailImage-beej2j-11')[0].getAttribute('src')) {
        addHiddenDiv('productImage', document.querySelectorAll('.styles__ThumbnailImage-beej2j-11')[0].getAttribute('src').split('?')[0]);
      } else if (document.querySelector('.slideDeckPicture')) {
        const pictureDiv = document.querySelector('.slideDeckPicture');
        if (pictureDiv.querySelector('img') && pictureDiv.querySelector('img').getAttribute('src')) {
          addHiddenDiv('productImage', pictureDiv.querySelector('img').getAttribute('src').split('?')[0]);
        }
      }
      const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
      const frameContents = document.getElementById('frameContents');
      if (frameContents) {
        addHiddenDiv('manufacturerDesc', frameContents.innerText);
        const manufacturerImgs = [];
        frameContents.querySelectorAll('img').forEach(e => {
          manufacturerImgs.push(e.getAttribute('src'));
        });
        addHiddenDiv('manufacturerImgs', manufacturerImgs.join(' | '));
      } else if (manufacturerCTA) {
        manufacturerCTA.click();
        const manufacturerImgs = [];
        if(document.getElementById('wcframable1-0') && document.getElementById('wcframable1-0').contentWindow) {
          let frameContents = document.getElementById('wcframable1-0').contentWindow.document.body;
          frameContents.querySelectorAll('img').forEach(e => {
            manufacturerImgs.push(e.src);
          });
          frameContents.querySelectorAll('video').forEach(e => {
            videos.push(e.src);
          });
        }
        if (document.getElementById('wc-power-page') && document.getElementById('wc-power-page').innerText) {
          const manufacturerDesc = [];
          document.querySelectorAll('.wc-fragment').forEach(e => {
            if(e.querySelector('.wc-pct-data')) {
              e.querySelectorAll('tr').forEach(tr => {
                if(tr.innerText && !manufacturerDesc.includes(tr.innerText)) {
                  manufacturerDesc.push(tr.innerText);
                }
              });
            } else {
              manufacturerDesc.push(e.innerText);
            }
          });
          addHiddenDiv('manufacturerDesc', manufacturerDesc.join(' '));
          document.querySelectorAll('img.wc-media.wc-image').forEach(e => {
            manufacturerImgs.push(e.src);
          });
          const aplusBody = document.querySelector('.wc-product-image-row');
          if (aplusBody) {
            aplusBody.querySelectorAll('.wc-pct-product-image').forEach(e => {
              manufacturerImgs.push(e.src);
            });
          }
          addHiddenDiv('manufacturerImgs', manufacturerImgs.join(' | '));
          document.getElementById('wc-power-page').querySelectorAll('video').forEach(e => {
            videos.push(e.src);
          });
        }
      }

      if (videos.length) {
        addHiddenDiv('videos', videos.join(' | '));
      }

      if (document.querySelector('.RatingSummary__StyledRating-bxhycp-0')) {
        addHiddenDiv('rating', document.querySelector('.RatingSummary__StyledRating-bxhycp-0').innerText);
      }
      if (document.querySelectorAll('.utils__ScreenReaderOnly-sc-1kni3r7-0').length > 0 && document.querySelectorAll('.utils__ScreenReaderOnly-sc-1kni3r7-0')[1]) {
        addHiddenDiv('ratingText', document.querySelectorAll('.utils__ScreenReaderOnly-sc-1kni3r7-0')[1].innerText);
      }

      const details = document.querySelector('a[href="#tabContent-tab-Details"]');

      let variations = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
      if (!variations.length) {
        variations = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
      }

      let isColorDropDown = false;
      if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
        if (!document.getElementById('options')) {
          document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
        }
        const options = document.getElementById('options');
        variations = options.querySelectorAll('a');
        isColorDropDown = true;
      }
      if (variations.length && details && !document.getElementById('variantCount')) {
        details.click();
        await stall(100);
        addHiddenDiv('variantCount', variations.length);
        if (isColorDropDown) {
          if (!document.getElementById('options') && document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
            document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
          }
          const options = document.getElementById('options');
          if (options.querySelectorAll('a').length) {
            options.querySelectorAll('a')[0].click();
          }
        } else {
          variations[0].click();
        }
        await stall(100);
        if (document && document.querySelectorAll('b').length) {
          document.querySelectorAll('b').forEach(e => {
            if (validTextField(e) && e.innerText.indexOf('TCIN') > -1) {
              addHiddenDiv('firstVariant', e.parentElement.innerText.split(':')[1]);
            }
          });
        }
        const variants = new Set();
        let i = 0;
        for (const variation of variations) {
          if (isColorDropDown) {
            if (!document.getElementById('options') && document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
              document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
            }
            const options = document.getElementById('options');
            if (options.querySelectorAll('a').length) {
              options.querySelectorAll('a')[i].click();
            }
          } else {
            variation.click();
          }
          await stall(50);
          if (document && document.querySelectorAll('b').length) {
            document.querySelectorAll('b').forEach(e => {
              if (validTextField(e) && e.innerText.indexOf('TCIN') > -1) {
                variants.add(e.parentElement.innerText.split(':')[1]);
              }
            });
          }
          i++;
        }
        if (variants.size > 0) {
          addHiddenDiv('variants', [...variants].join(' | '));
        }
      }
      if (document && document.getElementById('btnIndex')) {
        document.getElementById('btnIndex').innerHTML = parseInt(document.getElementById('btnIndex').innerHTML) + 1;
      }
    });

    const extraction = await context.extract(productDetails, { transform });
    console.log('extraction', extraction);
    extractedData.push(extraction[0]);
  }
  return extractedData;
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
