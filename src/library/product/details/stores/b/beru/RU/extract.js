const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    domain: 'pokupki.market.yandex.ru',
    zipcode: '',
  },
  implementation,
};
async function implementation(inputs, parameters, context, dependencies ) {
  const url = `${inputs.url}`;

  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForSelector('div.b_2TiXwODAcc a')
  .catch(() => { });
  const newPage = async () => {
  return await context.evaluate(async function () {
    const newPageEl = document.evaluate(
      "//div[@class='b_2TiXwODAcc']",
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (newPageEl.snapshotLength) {
      return 'true';
    } else {
      return 'false';
    }
  });
};


console.log('*************newPage' ,(await newPage()) === 'true');
  if((await newPage()) === 'true') {
    // await context.clickAndWaitForNavigation("div.b_2TiXwODAcc a")
    // .catch(() => { });
    const specification_navigate = await context.evaluate(async function () {
        return document.querySelector('div.b_2TiXwODAcc a').href;
      });
    
    console.log('specification_navigate' , specification_navigate);
    await context.goto(specification_navigate, { timeout: 5000, waitUntil: 'load', checkBlocked: true });

    const memory = {};
    const backconnect = !!memory.backconnect;
    console.log('backconnect', backconnect);
    const benchmark = !!memory.benchmark;
    console.log('benchmark', benchmark);
    const start = Date.now();
    const MAX_CAPTCHAS = 3;

    // let pageId;
    let captchas = 0;
    let hasCaptcha = false;
    let lastResponseData;
    // eslint-disable-next-line
    // const js_enabled = true; // Math.random() > 0.7;
    // console.log('js_enabled', js_enabled); ;

    const isCaptcha = async () => {
      return await context.evaluate(async function () {
        const captchaEl = document.evaluate(
          '//div[contains(@class, "captcha__image")]//img',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        if (captchaEl.snapshotLength) {
          return 'true';
        } else {
          return 'false';
        }
      });
    };

    const solveCaptcha = async () => {
      console.log('isCaptcha', true);

      await context.solveCaptcha({
        type: 'IMAGECAPTCHA',
        inputElement: 'form input[name="rep"]',
        imageElement: 'form img',
        autoSubmit: true,
      });
      console.log('solved captcha, waiting for page change');
      context.waitForNavigation();
      console.log('Captcha vanished');
    };

    const solveCaptchaIfNecessary = async () => {
      console.log('Checking for CAPTCHA');
      while ((await isCaptcha()) === 'true' && captchas < MAX_CAPTCHAS) {
        captchas++;
        if (backconnect) {
          throw Error('CAPTCHA received');
        }
        console.log('Solving a captcha', await isCaptcha(), captchas);
        await solveCaptcha();
      }
      if ((await isCaptcha()) === 'true') {
        if (!benchmark) {
          // we failed to solve the CAPTCHA
          console.log('We failed to solve the CAPTCHA');
          return context.reportBlocked(
            lastResponseData.code,
            'Blocked: Could not solve CAPTCHA, attempts=' + captchas
          );
        }
        return false;
      }
      return true;
    };
    await solveCaptchaIfNecessary();

    await context.evaluate(async () => {
    const specXpath = document.evaluate('//div[@class="_2aFJJAOXlE"]//text() | //div[@class="_3_bNW20rUd"]//text()', document, null, XPathResult.ANY_TYPE);
    if(specXpath) {
    var specificationList;
    let specification = '';
  
    specificationList = document.querySelectorAll('div.b_3_bNW20rUd');
    specificationList.forEach((element) => {
      specification +=
        element.children[0].innerText+':'+element.children[2].innerText+'||';
    });
    const specifications = [];
    specifications.push(specification.slice(0 , -1))
    console.log('=====Spec' , JSON.stringify(specifications));
    sessionStorage.setItem("Specifications", JSON.stringify(specifications));
  }  
  
  }); 
    await context.setBlockAds(false);
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await solveCaptchaIfNecessary();
    await context.evaluate(async () => {

      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    
      const specifications = JSON.parse(sessionStorage.getItem("Specifications"));
      console.log(specifications ,'specifications');
      if(specifications) {
        specifications.forEach(specs => {
          addHiddenDiv('import_specs', specs);
        })  
      }
    });
  }


  await context.evaluate(async () => {

    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let btnClick = document.querySelector('div.b_8lynrUTtGG');
    if (btnClick) {
      btnClick.click();
    }
    let bulletList = '';
    let bulletListTemp = '';
    let test = document.querySelectorAll('ul.b_1XvS5yuH7G li');
    test.forEach((element, index, array) => {
      if (index === array.length - 1) {
        bulletList += element.innerText;
        bulletListTemp += element.innerText;
      } else {
        bulletList += element.innerText+' || ';
        bulletListTemp += element.innerText+' || ';
      }
    });
    console.log(document.querySelectorAll('div.b_1xQdt6zCoE'));
    let desc = document.querySelectorAll('div.b_1xQdt6zCoE');
    desc.forEach((element) => {
      bulletList += element.innerText;
    });

    console.log(bulletList, 'bulletList');
    addHiddenDiv('bulletList', bulletList);
    addHiddenDiv('bulletListTemp', bulletListTemp);

    let imgClick = document.querySelector('div.b_2ke8Y2fll7');

    if (imgClick) {
      imgClick.click();
    }
    let images = document.querySelectorAll('div.b_Pqh2DLBHPJ ul li img');
    console.log(images, 'ss');
    const alternateImagesCount = images ? images.length : null;
    console.log(alternateImagesCount, 'alternateImagesCount');
    if (alternateImagesCount) {
      images.forEach((element) => {
        const secondaryImageLink = document.createElement('a');
        secondaryImageLink.setAttribute('class', 'alternateImages');
        secondaryImageLink.setAttribute('href', element.src);
        document.body.appendChild(secondaryImageLink);
      });

    }
    console.log(images, 'ss');
    let image_alt = document.querySelectorAll('div.b_2BHljydmvn.b_2qkQHl2AeT picture img')
    const alternateImagesCount_alt = image_alt ? image_alt.length : null;
    console.log(image_alt, 'alternateImagesCount');
    if (image_alt) {
      image_alt.forEach((element) => {
        const secondaryImageLink = document.createElement('a');
        secondaryImageLink.setAttribute('class', 'alternateImages_alt');
        secondaryImageLink.setAttribute('href', element.src.replace('orig', '1hq'));
        document.body.appendChild(secondaryImageLink);
      });
  
    }
    if (alternateImagesCount >= 1) {
      addHiddenDiv('alternateImagesCount', alternateImagesCount - 1);
    }
    if(alternateImagesCount_alt >= 1) {
      addHiddenDiv('alternateImagesCount_alt', alternateImagesCount_alt - 1);

    }
    let shippingInfo = document.querySelector('div.b_3S10tsnVL- a');
    let shippingInfoText = '';
    if (shippingInfo) {
      shippingInfoText = shippingInfo.textContent;
    }
    addHiddenDiv('shippingInfos', shippingInfoText);

    let close = document.querySelector('span.b_1-owM5mIx6');

    if (close) {
      close.click();
    }

    var xpath =
      "//span[contains(text() , 'Страна производства')]/../following-sibling::div/span";
    var countryOfOrigin = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let countryOfOriginText = '';
    if (countryOfOrigin) {
      countryOfOriginText = countryOfOrigin.textContent;
    }

    addHiddenDiv('countryOfOriginText', countryOfOriginText);
  let secondary_images = document.querySelectorAll('a.alternateImages').length
  if(secondary_images === 0) {
    let check_images = document.querySelectorAll('ul.b_3TWMCC_HPk li:not(:first-child)')
    if(check_images) {
      let image_alt = document.querySelectorAll('ul.b_3TWMCC_HPk li img')
    const alternateImagesCount_alt_1 = image_alt ? image_alt.length : null;
    if (image_alt) {
      image_alt.forEach((element) => {
        const secondaryImageLink = document.createElement('a');
        secondaryImageLink.setAttribute('class', 'alternateImages_alt_1');
        secondaryImageLink.setAttribute('href', element.src);
        document.body.appendChild(secondaryImageLink);
      });
    }
      addHiddenDiv('alternateImagesCount_alt_1', alternateImagesCount_alt_1);
  }
  }

    var xpath =
      "//span[contains(text() , 'Срок годности')]/../following-sibling::div/span";
    var storages = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let storageText = '';
    if (storages) {
      storageText = storages.textContent;
    }
    addHiddenDiv('storageText', storageText);
    var xpath =
      "//span[contains(text() , 'Вес')]/../following-sibling::div/span";
    var weight = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let weightText = '';
    if (weight) {
      weightText = weight.textContent;
    }
    addHiddenDiv('weightText', weightText);
    var xpath =
      "//span[contains(text() , 'Количество в упаковке')]/../following-sibling::div/span";
    var pack = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let packSize = '';
    if (pack) {
      packSize = pack.textContent;
    }
    addHiddenDiv('packSize', packSize);
    var xpath =
      "//span[contains(text() , 'Энергетическая ценность')]/../following-sibling::div/span";
    var calories = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let calorieData = '';
    if (calories) {
      calorieData = calories.textContent;
      if(calorieData.includes('/100')) {
        calorieData = calorieData.split('/')[0]
      }
    }
    addHiddenDiv('calorieData', calorieData);
    var xpath =
      "//span[contains(text() , 'Жиры в 100 г')]/../following-sibling::div/span";
    var fat = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let fatData = '';
    let fatDataUOM = '';
    if (fat) {
      fatData = fat.textContent;
      if (fatData) {
        fatDataUOM = fatData.split(' ')[1];
      }
    }
    addHiddenDiv('fatData', fatData.split(' ')[0]);
    addHiddenDiv('fatDataUOM', fatDataUOM);

    var xpath =
      "//span[contains(text() , 'Углеводы в')]/../following-sibling::div/span";
    var carbs = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let carbsData = '';
    let carbsDataUOM = '';
    if (carbs) {
      carbsData = carbs.textContent;
      if (carbsData) {
        carbsDataUOM = carbsData.split(' ')[1];
      }
    }
    addHiddenDiv('carbsData', carbsData.split(' ')[0]);
    addHiddenDiv('carbsDataUOM', carbsDataUOM);

    var xpath =
      "//span[contains(text() , 'Белки в')]/../following-sibling::div/span";
    var protein = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let proteinData = '';
    let proteinDataUOM = '';
    if (protein) {
      proteinData = protein.textContent;
      if (proteinData) {
        proteinDataUOM = proteinData.split(' ')[1];
      }
    }
    addHiddenDiv('proteinData', proteinData.split(' ')[0]);
    addHiddenDiv('proteinDataUOM', proteinDataUOM);

    var xpath =
      "//span[contains(text() , 'Состав')]/../following-sibling::div/span";
    var ingredientsData = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let ingredients = '';
    if (ingredientsData) {
      ingredients = ingredientsData.textContent;
    }
    addHiddenDiv('ingredients', ingredients);

    let spec = document.querySelector('div.b_2TiXwODAcc');
    if(spec === null) {
    var specificationList;
    let specification2 = '';

  specificationList = document.querySelectorAll('div.b_3_bNW20rUd');
  specificationList.forEach((element, index, array) => {
    specification2 +=
      element.children[0].innerText +':'+element.children[2].innerText+'||';
  });
  addHiddenDiv('specification_2', specification2);
}
let spec2 = document.querySelector('div.b_E8vloAGwWm');
if(spec2) {
  var specificationList1;
  let specification1 = '';

  specificationList1 = document.querySelectorAll('div.b_E8vloAGwWm');
  specificationList1.forEach((element, index, array) => {
    specification1 +=
      element.children[0].innerText +':'+element.children[2].innerText+'||';
  });
  addHiddenDiv('specification_alt', specification1);
}

    let variantInfo = document.querySelectorAll('span.b_orEV9DcwNt');
if(variantInfo) {
  let variantList = '';
  variantInfo.forEach((element, index, array) => {
    variantList +=  element.innerText +' | ';
  });
  addHiddenDiv('variantList', variantList.slice(0 , -2));
}

  });
  try{
    await context.evaluate(() => {
    document.querySelector('div[data-zone-name="footer"]').scrollIntoView();
    });
    await context.waitForSelector('div[data-apiary-widget-id="/ProductAccessories"]');
  }catch(err)
  {
    console.log('not found');
  } 
  
  return await context.extract(productDetails, { transform });
}
