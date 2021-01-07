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

 
  

  await context.waitForSelector('div.b_2TiXwODAcc a')
  .catch(() => { });
  await context.clickAndWaitForNavigation("div.b_2TiXwODAcc a")
  .catch(() => { });
  await context.waitForSelector('div.b_3_bNW20rUd')
  .catch(() => { });
  await context.evaluate(async () => {
  const specXpath = document.evaluate('//div[@class="_2aFJJAOXlE"]//text() | //div[@class="_3_bNW20rUd"]//text()', document, null, XPathResult.ANY_TYPE);
  let spec_new = document.querySelector('div.b_E8vloAGwWm');
if(spec_new === undefined) {
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
    sessionStorage.setItem("Specifications", JSON.stringify(specifications));
  }  
}

});  
await context.waitForSelector('div.b_D2rV3eJmpM a')
.catch(() => { });
await context.clickAndWaitForNavigation("div.b_D2rV3eJmpM a")
.catch(() => { });
       
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
  specifications.forEach(specs => {
    addHiddenDiv('import_specs', specs);
  })  
});
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
      // const secondaryImageCount = document.createElement('div');
      // secondaryImageCount.setAttribute('class', 'alternateImagesCountTotal');
      // // @ts-ignore
      // secondaryImageCount.setAttribute('sum', alternateImagesCount);
      // document.body.appendChild(secondaryImageCount);
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
      // const secondaryImageCount = document.createElement('div');
      // secondaryImageCount.setAttribute('class', 'alternateImagesCountTotal');
      // // @ts-ignore
      // secondaryImageCount.setAttribute('sum', alternateImagesCount);
      // document.body.appendChild(secondaryImageCount);
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

    // var xpath =
    //   " //span[@class='b_orEV9DcwNt']";
    // var variantInfoText = document.evaluate(
    //   xpath,
    //   document,
    //   null,
    //   XPathResult.FIRST_ORDERED_NODE_TYPE,
    //   null
    // ).singleNodeValue;
    // let variantInfo = '';
    // if (variantInfoText) {
    //   variantInfo += variantInfoText.textContent+'|';
    // }

    // addHiddenDiv('variantInfo', variantInfo);
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

    // var popUP = document.evaluate(
    // xpath,
    // document,
    // null,
    // XPathResult.FIRST_ORDERED_NODE_TYPE,
    // null
    // ).singleNodeValue;
   
    let spec = document.querySelector('div.b_2TiXwODAcc');
if(spec != undefined) {
  var specificationList;
  let specification2 = '';

  specificationList = document.querySelectorAll('div.b_3_bNW20rUd');
  specificationList.forEach((element, index, array) => {
    specification2 +=
      element.children[0].innerText +':'+element.children[2].innerText+'||';
  });
  addHiddenDiv('specification_2', specification2);
}
let spec_new = document.querySelectorAll('div[data-auto="sku-specs"]')[0];
if(spec_new) {
  var specificationList1;
  let specification1 = '';

  specificationList1 = spec_new.querySelectorAll('div.b_E8vloAGwWm');
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
  
  return await context.extract(productDetails, { transform });
}
