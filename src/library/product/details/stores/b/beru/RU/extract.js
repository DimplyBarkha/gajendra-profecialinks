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
async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mainUrl = await context.evaluate(() => {
    return window.location.href;
  });
  console.log('mainUrl---->', mainUrl);
  let url = '';
  try {
    url = await context.evaluate(() => {
      return document.querySelector('div.b_2TiXwODAcc a').href || '';
    });
  } catch (error) {
    console.log('Read more not available');
  }

  // let ingredients = '';
  let protine = '';
  let totalWeight = '';
  let storage = '';
  let cuntryOfOrigin = '';
  let ingredients = '';
  let calories = '';
  let packsize = '';
  let fatServing = '';
  let carbsServing = '';
  let carbsServingUOM = '';
  let proteinUOM = '';
  let fatUOM = '';
  let specification;

  await context.evaluate(async () => {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  console.log('url---->', url);
  if (url) {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, {
      timeout: 50000,
      waitUntil: 'load',
      checkBlocked: true,
    });
    try {
    } catch (error) {
      console.log('Cookie button click fail');
    }
    try {
      // await context.waitForSelector('p.category');
    } catch (error) {
      console.log('selector not present');
    }
    console.log('In second page');
    // ingredients = await context.evaluate(() => {
    //   console.log('ingredientSelector', document.querySelector('h1'));
    //   const ingredientSelector = document.querySelector('h1');
    //   return ingredientSelector ? ingredientSelector.innerText : '';
    // });
    protine = await context.evaluate(() => {
      const protineSelector = document.evaluate(
        "//span[contains(text() , 'Белки в')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return protineSelector ? protineSelector.innerText : '';
    });
    totalWeight = await context.evaluate(() => {
      const totalWeightSelector = document.evaluate(
        "//span[contains(text() , 'Вес')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return totalWeightSelector ? totalWeightSelector.innerText : '';
    });
    storage = await context.evaluate(() => {
      const storageSelector = document.evaluate(
        "//span[contains(text() , 'Срок годности')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return storageSelector ? storageSelector.innerText : '';
    });
    cuntryOfOrigin = await context.evaluate(() => {
      const cuntryOfOriginSelector = document.evaluate(
        "//span[contains(text() , 'Страна производства')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return cuntryOfOriginSelector ? cuntryOfOriginSelector.innerText : '';
    });
    ingredients = await context.evaluate(() => {
      const ingredientsSelector = document.evaluate(
        "//span[contains(text() , 'Состав')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return ingredientsSelector ? ingredientsSelector.innerText : '';
    });
    packsize = await context.evaluate(() => {
      const packsizeSelector = document.evaluate(
        "//span[contains(text() , 'Количество в упаковке')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return packsizeSelector ? packsizeSelector.innerText : '';
    });
    calories = await context.evaluate(() => {
      const caloriesSelector = document.evaluate(
        "//span[contains(text() , 'Энергетическая ценность')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return caloriesSelector ? caloriesSelector.innerText : '';
    });
    fatServing = await context.evaluate(() => {
      const fatServingSelector = document.evaluate(
        "//span[contains(text() , 'Жиры в 100 г')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return fatServingSelector ? fatServingSelector.innerText : '';
    });
    carbsServing = await context.evaluate(() => {
      const carbsServingSelector = document.evaluate(
        "//span[contains(text() , 'Углеводы в')]/../following-sibling::div/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return carbsServingSelector ? carbsServingSelector.innerText : '';
    });
    specification = await context.evaluate(() => {
      let childrenData;
      let AllchildrenData = '';
      childrenData = document.querySelectorAll('div.b_3_bNW20rUd');
      childrenData.forEach((element) => {
        AllchildrenData +=
          element.children[0].innerText +
          ':' +
          element.children[2].innerText +
          '|';
      });
      return AllchildrenData;
      // const carbsServingSelector = document.evaluate('//div[@class="b_3_bNW20rUd"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // return carbsServingSelector ? carbsServingSelector.innerText : '';
    });
    console.log(specification, 'specification');

    if (carbsServing) {
      carbsServingUOM = carbsServing.split(' ')[1];
    }
    if (fatServing) {
      fatUOM = fatServing.split(' ')[1];
    }
    if (protine) {
      proteinUOM = protine.split(' ')[1];
    }

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(mainUrl, {
      timeout: 50000,
      waitUntil: 'load',
      checkBlocked: true,
    });
    try {
    } catch (error) {
      console.log('Cookie button click fail');
    }
  }

  await context.evaluate(
    ({
      specification,
      fatUOM,
      proteinUOM,
      carbsServingUOM,
      carbsServing,
      protine,
      totalWeight,
      storage,
      cuntryOfOrigin,
      ingredients,
      packsize,
      calories,
      fatServing,
    }) => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // addHiddenDiv('calories_added', ingredients);
      addHiddenDiv('protine_added', protine);
      addHiddenDiv(' totalWeight_added', totalWeight);
      addHiddenDiv('storage_added', storage);
      addHiddenDiv('ingredients_added', ingredients);
      addHiddenDiv('cuntryOfOrigin_added', cuntryOfOrigin);
      addHiddenDiv('packsize_added', packsize);
      addHiddenDiv('calories_added', calories);
      addHiddenDiv('fatServing_added', fatServing);
      addHiddenDiv('carbsServing_added', carbsServing);
      addHiddenDiv('carbsServingUOM_added', carbsServingUOM);
      addHiddenDiv('fatUOM_added', fatUOM);
      addHiddenDiv('proteinUOM_added', proteinUOM);
      addHiddenDiv('specification_added', specification);
    },
    {
      specification,
      fatUOM,
      proteinUOM,
      carbsServingUOM,
      carbsServing,
      protine,
      totalWeight,
      storage,
      cuntryOfOrigin,
      ingredients,
      packsize,
      calories,
      fatServing,
    }
  );

  await context.evaluate(async () => {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
 
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
    let test = document.querySelectorAll('ul.b_1XvS5yuH7G li');
    test.forEach((element, index, array) => {
      if (index === array.length - 1) {
        bulletList += element.innerText;
      } else {
        bulletList += element.innerText + '|';
      }
    });
    console.log(document.querySelectorAll('div.b_1xQdt6zCoE'));
    let desc = document.querySelectorAll('div.b_1xQdt6zCoE');
    desc.forEach((element) => {
      bulletList += element.innerText;
    });

    console.log(bulletList, 'bulletList');
    addHiddenDiv('bulletList', bulletList);

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
      // const secondaryImageCount = document.createElement('div');
      // secondaryImageCount.setAttribute('class', 'alternateImagesCountTotal');
      // // @ts-ignore
      // secondaryImageCount.setAttribute('sum', alternateImagesCount);
      // document.body.appendChild(secondaryImageCount);
    }
    addHiddenDiv('alternateImagesCount', alternateImagesCount - 1);
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
    addHiddenDiv('fatData', fatData);
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
    addHiddenDiv('carbsData', carbsData);
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
    addHiddenDiv('proteinData', proteinData);
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
    var xpath =
      '//div[@data-id="popup"]/table//button[@data-text="Accept all"]';
    var popUP = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    console.log('s', popUP);
    var specificationList;
    let specification = '';

    specificationList = document.querySelectorAll('div.b_3_bNW20rUd');
    specificationList.forEach((element) => {
      specification +=
        element.children[0].innerText +
        ':' +
        element.children[2].innerText +
        '|';
    });
    addHiddenDiv('specification', specification);
  });
 
  return await context.extract(productDetails, { transform });
}
