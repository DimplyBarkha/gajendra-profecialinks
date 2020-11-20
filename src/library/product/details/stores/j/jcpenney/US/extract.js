const { transform } = require('./shared');

async function implementation (
inputs,
parameters,
context,
dependencies,
) {
const { transform } = parameters;
const { productDetails } = dependencies;

await context.evaluate(async function () {
    const isSelector = document.evaluate('//h3[contains(.,"Oops, something went wrong")]', document).iterateNext();
    if (isSelector) {
      throw Error(isSelector.textContent);
    }
  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  function appendImages (selector, images) {
    [...document.querySelectorAll(selector)].map((e, index) => { e.setAttribute('mainImage', `https:${images[index][0]}`); });
  }

  const optionalWait = async (sel) => {
    try {
      await context.waitForSelector(sel, { timeout: 60000 });
    } catch (err) {
      console.log(`Couldn't load selector => ${sel}`);
    }
  };

  let color = [...document.querySelectorAll('ul[data-automation-id="product-dimensions-color"] li')].map(e => { return e.querySelector('button').getAttribute('data-for')});

  for (i = 0; i < color.length; i++) {
    document.querySelectorAll('ul[data-automation-id="product-dimensions-color"] li')[i].setAttribute('color', color[i]);
    let newDiv3 = document.createElement('div');
    newDiv3.id = 'text';
    document.querySelectorAll('ul[data-automation-id="product-dimensions-color"] li button')[i].appendChild(newDiv3).innerHTML = color[i];
   }

  const finalImages = [];
  const isVariants = document.querySelector('#option-wrapper-false #product-options-false');
  const variants = '#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li';

  if (isVariants) {
    optionalWait('h1[data-automation-id="product-title"]');
    document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li button').forEach(ele => {
      ele.click();
      console.log('Clicked');
      const skus = [];
      const mpc = [];
      var array = [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')];
      if (__PRELOADED_STATE__.productDetails.lots.length > 1) {
        for (i = 0; i < __PRELOADED_STATE__.productDetails.lots.length; i++) {
          skus.push(`${__PRELOADED_STATE__.productDetails.lots[i].items[0].id}`);
        }
        for (i = 0; i < __PRELOADED_STATE__.productDetails.lots.length; i++) {
          mpc.push(`${__PRELOADED_STATE__.productDetails.lots[i].id}`);
        }
      } else {
        for (i = 0; i < __PRELOADED_STATE__.productDetails.lots[0].items.length; i++) {
          skus.push(__PRELOADED_STATE__.productDetails.lots[0].items[i].id);
        }
        for (i = 0; i < __PRELOADED_STATE__.productDetails.lots.length; i++) {
          mpc.push(__PRELOADED_STATE__.productDetails.lots[i].id);
        }
      }

      for (i = 0; i < array.length; i++) {
        if (skus[i] == undefined) {
          array[i].setAttribute('skuId', skus[0]);
        } else {
          array[i].setAttribute('skuId', skus[i]);
        }
      }

      const arr = skus.filter (function (value, index, array) {
        return skus.indexOf(value) === index;
    });

      document.querySelector('h1[data-automation-id="product-title"]').setAttribute('variants', arr);

      for (i = 0; i < array.length; i++) {
        if (mpc[i] == undefined) {
          array[i].setAttribute('mpc', mpc[0]);
        } else {
          array[i].setAttribute('mpc', mpc[i]);
        }
      }
      document.querySelector('h1[data-automation-id="product-title"]').setAttribute('firstvariant', skus[0]);

      [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
        e.setAttribute('nameExtended', `${document.querySelector('h1[data-automation-id="product-title"]').textContent}` + ` - ${e.textContent}`);
      });

      [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
        e.setAttribute('secondaryImages', [...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return `https:${e.querySelector('img').getAttribute('src')}`; }));
      });

      finalImages.push([...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a')].map(e => { return e.querySelector('img').getAttribute('src'); }));
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
    var skus = jsonString.offers.map(e => e.sku);
    for (i = 0; i < array.length; i++) {
      array[i].setAttribute('skuId', skus[i]);
    }

    [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
      e.setAttribute('nameExtended', `${document.querySelector('h1[data-automation-id="product-title"]').textContent} ` + `- ${e.textContent}`);
    });

    [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
      e.setAttribute('secondaryImages', [...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a:not(._2JSHu)')].map(e => { return `https:${e.querySelector('img').getAttribute('src')}`; }));
    });

    [...document.querySelectorAll('#option-wrapper-false #product-options-false > div:nth-last-child(1) ul li')].map((e) => {
      e.setAttribute('mpc', `${document.querySelector('div[data-automation-id="product-title"] span._3_di8').textContent}`);
    });

    finalImages.push([...document.querySelectorAll('#contentContainer > section > section:nth-child(3) > div.sm12.md6.lg6.xl7._3AtEJ > div > div.carousel-wrapper > div > div._3h_IA.lg2.xl2.md2.sm2._1sbcC.noPad > div > div.slick-list a')].map(e => { return e.querySelector('img').getAttribute('src'); }));
  }
  appendImages(variants, finalImages);
  const brand = document.evaluate('//script[@type="application/ld+json"][contains(.,"brand")]', document).iterateNext().textContent.split('"brand":{"@type":"Thing","name":"')[1].split('"},')[0];
  document.querySelector('h1[data-automation-id="product-title"]').setAttribute('brand', brand);
  var availability = document.querySelector('div._1YUMp');
  if (availability) {
    var status = availability.textContent;
    if (status.includes('Out of Stock')) {
      availability = 'Out of Stock';
      document.querySelector('h1[data-automation-id="product-title"]').setAttribute('availability', availability);
    }
  } else {
    availability = 'In Stock';
    document.querySelector('h1[data-automation-id="product-title"]').setAttribute('availability', availability);
  }

  let prop = document.evaluate('//h3[@data-automation-id="general-info-title"][contains(.,"Proposition 65 WARNING")]',document).iterateNext();

  if(prop){
    document.querySelector('p._1d56W button').click();
   let prop65Info =  document.querySelector('[data-automation-id="modal-content"] div div p:nth-last-child(1)').textContent.replace(/www/g,"https://www")
   document.querySelector('h1[data-automation-id="product-title"]').setAttribute('prop65', prop65Info);
   document.querySelector('[data-automation-id="modal-content"] button[data-automation-id="at-button-default-id"]').click();
  }

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
