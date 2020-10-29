const { transform } = require('./shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function appendImages(selector, images) {
      [...document.querySelectorAll(selector)].map((e, index) => { e.setAttribute('mainImage', `${images[index][0]}`)});
    }

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    const finalImages = [];
    const isVariants = document.querySelector('#option-wrapper-false #product-options-false');
    const variants = '#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li';

    if (isVariants) {
      optionalWait('h1[data-automation-id="product-title"]');
      document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li button').forEach(ele => {
        ele.click();
        console.log('Clicked');
        const skus =[];
        var array = [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')];
        for (i=0;i<__PRELOADED_STATE__.productDetails.lots[0].items.length;i++){
          skus.push(__PRELOADED_STATE__.productDetails.lots[0].items[i].id)
          }

        for ( i = 0; i < array.length; i++ ) {
         if( skus[i] == undefined){
         array[i].setAttribute('skuId', skus[0]);
          } else {
          array[i].setAttribute('skuId', skus[i]);
          }
        }
        [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
          e.setAttribute("nameExtended",`${document.querySelector('h1[data-automation-id="product-title"]').textContent}` + `- ${e.textContent}`)});

        [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
          e.setAttribute("secondaryImages", [...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return `https:${e.querySelector('img').getAttribute('src')}`}))});

        finalImages.push([...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a')].map(e => { return e.querySelector('img').getAttribute('src')}));
      });
    } else {
      optionalWait('h1[data-automation-id="product-title"]');
      var newDiv = document.createElement('div');
      newDiv.id = 'option-wrapper-false';
      document.querySelector('section[id="dimensions-false"]').append(newDiv);
      var newDiv1 = document.createElement('div');
      newDiv1.id = 'product-options-false';
      document.querySelector('section[id="dimensions-false"] #option-wrapper-false').append(newDiv1);
      var newDiv2 = document.createElement('div');
      document.querySelector('#option-wrapper-false #product-options-false').appendChild(newDiv2);
      var newUl = document.createElement('ul');
      document.querySelector('#option-wrapper-false #product-options-false div').appendChild(newUl);
      var newLi = document.createElement('li');
      document.querySelector('#option-wrapper-false #product-options-false div ul').appendChild(newLi);
      var array = [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')];
      var jsonString = JSON.parse(document.querySelector("script[type='application/ld+json']").innerText);
      var skus = jsonString.offers.map(e=>e.sku);
      for ( i = 0; i < array.length; i++ ) {
        array[i].setAttribute('skuId', skus[i]);
       }
      [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
      e.setAttribute("nameExtended",`${document.querySelector('h1[data-automation-id="product-title"]').textContent} ` + `- ${e.textContent}`)});

      [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
      e.setAttribute("secondaryImages", [...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return `https:${e.querySelector('img').getAttribute('src')}`}))});

     finalImages.push([...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a')].map(e => { return e.querySelector('img').getAttribute('src')}));
    }
    appendImages(variants, finalImages);
    const brand = document.evaluate('//script[@type="application/ld+json"][contains(.,"brand")]',document).iterateNext().textContent.split('"brand":{"@type":"Thing","name":"')[1].split('"},')[0];
    document.querySelector('h1[data-automation-id="product-title"]').setAttribute('brand', brand);
    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    transform,
    domain: 'jcpenney.com',
    zipcode: '',
  },
  implementation,
};
