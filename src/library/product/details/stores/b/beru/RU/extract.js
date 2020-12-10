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
        bulletList += element.innerText + '|';
        bulletListTemp += element.innerText + '|';
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
    if (alternateImagesCount >= 1) {
      addHiddenDiv('alternateImagesCount', alternateImagesCount - 1);
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

    // var popUP = document.evaluate(
    // xpath,
    // document,
    // null,
    // XPathResult.FIRST_ORDERED_NODE_TYPE,
    // null
    // ).singleNodeValue;

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

    let variantsInfo = document.querySelectorAll('span.b_1vzk4iYy5n');
    if (variantsInfo) {
      variantsInfo.forEach((element) => {
        const secondaryImageLink = document.createElement('div');
        secondaryImageLink.setAttribute('class', 'variantsInfoData');
        element.click();
        secondaryImageLink.setAttribute('href', element.textContent);
        document.body.appendChild(secondaryImageLink);
      });
      let variantsImgInfo = document.querySelectorAll(
        'div.b_vsxt0dVvL4 img.b_ZM3OPI2WFF'
      );
      if (variantsImgInfo) {
        variantsImgInfo.forEach((element) => {
          const secondaryImageLink = document.createElement('div');
          secondaryImageLink.setAttribute('class', 'variantsInfoData');
          element.click();
          secondaryImageLink.setAttribute('href', element.textContent);
          document.body.appendChild(secondaryImageLink);
        });
        // const secondaryImageCount = document.createElement('div');
        // secondaryImageCount.setAttribute('class', 'alternateImagesCountTotal');
        // // @ts-ignore
        // secondaryImageCount.setAttribute('sum', alternateImagesCount);
        // document.body.appendChild(secondaryImageCount);
      }
    }
  });

  return await context.extract(productDetails, { transform });
}
