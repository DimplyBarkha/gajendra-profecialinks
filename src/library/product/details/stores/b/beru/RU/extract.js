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
  dependencies: {
    goto: 'action:navigation/goto',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
async function implementation (inputs, parameters, context, dependencies) {
  const url = `${inputs.url}`;

  const { transform } = parameters;
  const { productDetails, goto } = dependencies;

  await context.waitForSelector('div.b_2TiXwODAcc a')
    .catch(() => { });
  const newPage = async () => {
    return await context.evaluate(async function () {
      const newPageEl = document.evaluate(
        "//div[@class='b_2TiXwODAcc']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      if (newPageEl.snapshotLength) {
        return 'true';
      } else {
        return 'false';
      }
    });
  };

  console.log('*************newPage', (await newPage()) === 'true');
  if ((await newPage()) === 'true') {
    // await context.clickAndWaitForNavigation("div.b_2TiXwODAcc a")
    // .catch(() => { });
    const specification_navigate = await context.evaluate(async function () {
      return document.querySelector('div.b_2TiXwODAcc a').href;
    });

    console.log('specification_navigate', specification_navigate);
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
    const hasCaptcha = false;
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
          null,
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
            'Blocked: Could not solve CAPTCHA, attempts=' + captchas,
          );
        }
        return false;
      }
      return true;
    };
    await solveCaptchaIfNecessary();

    await context.evaluate(async () => {
      const specXpath = document.evaluate('//div[@class="_2aFJJAOXlE"]//text() | //div[@class="_3_bNW20rUd"]//text()', document, null, XPathResult.ANY_TYPE);
      if (specXpath) {
        var specificationList;
        let specification = '';

        specificationList = document.querySelectorAll('div.b_3_bNW20rUd');
        specificationList.forEach((element) => {
          specification +=
        element.children[0].innerText + ':' + element.children[2].innerText + '||';
        });
        const specifications = [];
        specifications.push(specification.slice(0, -1));
        console.log('=====Spec', JSON.stringify(specifications));
        sessionStorage.setItem('Specifications', JSON.stringify(specifications));
      }
    });
    await context.setBlockAds(false);
    await goto({ url });
    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const specifications = JSON.parse(sessionStorage.getItem('Specifications'));
      console.log(specifications, 'specifications');
      if (specifications) {
        specifications.forEach(specs => {
          addHiddenDiv('import_specs', specs);
        });
      }
    });
  }

  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const btnClick = document.querySelector('div.b_8lynrUTtGG');
    if (btnClick) {
      btnClick.click();
    }
    let bulletList = '';
    let bulletListTemp = '';
    const test = document.querySelectorAll('ul.b_1XvS5yuH7G li');
    test.forEach((element, index, array) => {
      if (index === array.length - 1) {
        bulletList += element.innerText;
        bulletListTemp += element.innerText;
      } else {
        bulletList += element.innerText + ' || ';
        bulletListTemp += element.innerText + ' || ';
      }
    });
    console.log(document.querySelectorAll('div.b_1xQdt6zCoE'));
    const desc = document.querySelectorAll('div.b_1xQdt6zCoE');
    desc.forEach((element) => {
      bulletList += element.innerText;
    });

    console.log(bulletList, 'bulletList');
    addHiddenDiv('bulletList', bulletList);
    addHiddenDiv('bulletListTemp', bulletListTemp);

    //des for second type format page
    let desc2 = document.querySelector('span.b_3JsGNgDHFb');
    if(desc2) {
      addHiddenDiv('desList', desc2.innerText);
    }


    let imgClick = document.querySelector('div.b_2ke8Y2fll7');

    if (imgClick) {
      imgClick.click();
    }
    const images = document.querySelectorAll('div.b_Pqh2DLBHPJ ul li img');
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
    const image_alt = document.querySelectorAll('div.b_2BHljydmvn.b_2qkQHl2AeT picture img');
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
    if (alternateImagesCount_alt >= 1) {
      addHiddenDiv('alternateImagesCount_alt', alternateImagesCount_alt - 1);
    }
    const shippingInfo = document.querySelector('div.b_3S10tsnVL- a');
    let shippingInfoText = '';
    if (shippingInfo) {
      shippingInfoText = shippingInfo.textContent;
    }
    addHiddenDiv('shippingInfos', shippingInfoText);

    const close = document.querySelector('span.b_1-owM5mIx6');

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
      null,
    ).singleNodeValue;
    let countryOfOriginText = '';
    if (countryOfOrigin) {
      countryOfOriginText = countryOfOrigin.textContent;
    }

    addHiddenDiv('countryOfOriginText', countryOfOriginText);
    const secondary_images = document.querySelectorAll('a.alternateImages').length;
    if (secondary_images === 0) {
      const check_images = document.querySelectorAll('ul.b_3TWMCC_HPk li:not(:first-child)');
      if (check_images) {
        const image_alt = document.querySelectorAll('ul.b_3TWMCC_HPk li img');
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
      null,
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
      null,
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
      null,
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
      null,
    ).singleNodeValue;
    let calorieData = '';
    if (calories) {
      calorieData = calories.textContent;
      if (calorieData.includes('/100')) {
        calorieData = calorieData.split('/')[0];
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
      null,
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
      null,
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
      null,
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
      "//span[text() ='Состав']/../following-sibling::div/span";
    var ingredientsData = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    let ingredients = '';
    if (ingredientsData) {
      ingredients = ingredientsData.textContent;
    }
    addHiddenDiv('ingredients', ingredients);

    const spec = document.querySelector('div.b_2TiXwODAcc');
    if (spec === null) {
      var specificationList;
      let specification2 = '';

      specificationList = document.querySelectorAll('div.b_3_bNW20rUd');
      specificationList.forEach((element, index, array) => {
        specification2 +=
      element.children[0].innerText + ':' + element.children[2].innerText + '||';
      });
      addHiddenDiv('specification_2', specification2);
    }
    const spec2 = document.querySelectorAll('div.b_2O3fAVsCrX')[1];
    if (spec2) {
      var specificationList1;
      let specification1 = '';

      specificationList1 = spec2.querySelectorAll('div.b_E8vloAGwWm');
      specificationList1.forEach((element, index, array) => {
        specification1 +=
      element.children[0].innerText + ':' + element.children[2].innerText + '||';
      });
      addHiddenDiv('specification_alt', specification1);
    }

    const variantInfo = document.querySelectorAll('span.b_orEV9DcwNt');
    if (variantInfo) {
      let variantList = '';
      variantInfo.forEach((element, index, array) => {
        variantList += element.innerText + ' | ';
      });
      addHiddenDiv('variantList', variantList.slice(0, -2));
    }
  });
  try {
    await context.evaluate(() => {
      document.querySelector('div[data-zone-name="footer"]').scrollIntoView();
    });
    await context.waitForSelector('div[data-apiary-widget-id="/ProductAccessories"]');
  } catch (err) {
    console.log('not found');
  }
  try {
    await context.click('[data-id="button-all"]');
  } catch (error) {
    console.log('No cookies button');
  }
  async function addPDP (productId) {
    const sk = state.user.sk;
    const API = 'https://pokupki.market.yandex.ru/api/render-lazy';
    const body = {
      widgets: [
        {
          lazyId: 'AlsoViewed',
          widgetName: '@marketplace/ScrollBox',
          options: {
            id: 'AlsoViewed',
            mboWidgetId: 'AlsoViewed',
            props: {
              minCountToShow: 6,
              withGutters: true,
              showControls: true,
              metrika: 'also-viewed',
              theme: 'light',
              title: 'Похожие товары в наличии',
              titleParams: {
                size: '700',
                align: 'center',
              },
              paddingTop: 'condensed',
              paddingBottom: 'condensed',
              ratio: [
                1,
                4,
              ],
              controlsSize: 'l',
              stickyBox: {
                isOneTimeSticky: true,
                paddingTop: 'normal',
                stickTo: 'bottom',
                animation: 'slide',
              },
              snippets: {
                theme: 'quince',
                withReasonsToBuy: true,
              },
            },
            resources: {
              garsons: [
                {
                  id: 'AlsoViewed',
                  count: 12,
                  params: {
                    hyperid: productId,
                    'show-models-specs': 'friendly',
                    billingZone: 'skuCardAlsoViewed',
                    'ban-mode': 'soft',
                    additional_entities: 'sponsored_mimic',
                  },
                },
              ],
            },
            name: 'ScrollBox',
            otherCmsOptions: {
              entity: 'widget',
              loadMode: 'lazy',
              placeholder: 'Spinner',
            },
          },
          slotOptions: {},
        }, {
          lazyId: 'ProductAccessories',
          widgetName: '@marketplace/ScrollBox',
          options: {
            id: 'ProductAccessories',
            mboWidgetId: 'ProductAccessories',
            props: {
              minCountToShow: 6,
              withGutters: true,
              showControls: true,
              metrika: 'upsale',
              theme: 'light',
              title: 'С этим товаром покупают',
              titleParams: {
                size: '700',
                align: 'center',
              },
              paddingTop: 'normal',
              paddingBottom: 'none',
              ratio: [
                1,
                6,
              ],
              controlsSize: 'm',
              snippets: {
                withReasonsToBuy: true,
                reasonsToBuy: {
                  showCustomersChoice: true,
                  showBestFactor: false,
                },
              },
            },
            resources: {
              garsons: [
                {
                  id: 'ProductAccessories',
                  count: 12,
                  params: {
                    hyperid: productId,
                    marketSku: window.location.pathname.match(/[^\/]+$/)[0],
                    billingZone: 'skuCardAccessories',
                    'show-models-specs': 'friendly',
                    additional_entities: 'sponsored_mimic',
                    banMode: 'soft',
                  },
                },
              ],
            },
            name: 'ScrollBox',
            otherCmsOptions: {
              entity: 'widget',
              loadMode: 'lazy',
              placeholder: 'SnippetScrollbox',
            },
          },
          slotOptions: {},
        }, {
          lazyId: '95034849',
          widgetName: '@marketplace/GroupOfWidgets',
          options: {
            id: 95034849,
            mboWidgetId: 95034849,
            props: {
              widgets: [
                {
                  props: {
                    skuId: window.location.pathname.match(/[^\/]+$/)[0],
                    usePrimeGarsonOnAdvertising: false,
                    offerId: 'U0PrBUn4Z-0-mrH2BBtt9g',
                    resources: {
                      garsons: [
                        {
                          count: 20,
                          limit: 50,
                          params: {
                            billingZone: 'default',
                            hyperid: 6,
                            marketSku: '12214',
                            key: 'accessories',
                            minCountToShow: 6,
                          },
                          id: 'ComplementaryProductsByGroupKey',
                        },
                      ],
                    },
                    scrollBoxCmsDescription: {
                      entity: 'widget',
                      name: 'ScrollBox',
                      id: 95034856,
                      loadMode: 'default',
                      resources: {
                        garsons: [
                          {
                            id: 'CommonlyPurchasedProducts',
                            count: 15,
                            params: {
                              rgb: 'BLUE',
                            },
                          },
                        ],
                        completers: [],
                      },
                      wrapperProps: {
                        shadow: '',
                        title: {
                          text: 'Аксессуары',
                          align: 'center',
                          theme: 'normal',
                          size: '700',
                        },
                        margins: {
                          top: '7',
                          bottom: '7',
                        },
                      },
                      props: {
                        subtitle: {
                          type: 'default',
                        },
                        titleParams: {
                          size: 'm',
                          type: 'default',
                        },
                        paddingTop: 'none',
                        paddingBottom: 'none',
                        paddingLeft: 'none',
                        paddingRight: 'none',
                        theme: 'light',
                        titleStyle: 'default',
                        compensateSideMargin: false,
                        size: 'm',
                        ratio: [
                          1,
                          6,
                        ],
                        showControls: true,
                        controlsSize: 'm',
                        align: 'top',
                        horizontalAlign: 'left',
                        minCountToShow: 0,
                        deduplicate: false,
                        clickableTitle: false,
                        withSeparator: false,
                        adaptiveLayout: false,
                        isAdult: false,
                      },
                    },
                  },
                  id: 95034851,
                  name: 'SkuComplementaryProducts',
                  entity: 'widget',
                },
                {
                  props: {
                    skuId: window.location.pathname.match(/[^\/]+$/)[0],
                    usePrimeGarsonOnAdvertising: true,
                    offerId: 'U0PrBUn4Z-0-mrH2BBtt9g',
                    resources: {
                      garsons: [
                        {
                          count: 20,
                          limit: 50,
                          params: {
                            billingZone: 'default',
                            hyperid: 6,
                            marketSku: '12214',
                            key: 'complementary_items',
                            minCountToShow: 6,
                          },
                          id: 'ComplementaryProductsByGroupKey',
                        },
                      ],
                    },
                    scrollBoxCmsDescription: {
                      entity: 'widget',
                      name: 'ScrollBox',
                      id: 95034869,
                      loadMode: 'default',
                      resources: {
                        garsons: [
                          {
                            id: 'CommonlyPurchasedProducts',
                            count: 15,
                            params: {
                              rgb: 'BLUE',
                            },
                          },
                        ],
                        completers: [],
                      },
                      wrapperProps: {
                        shadow: '',
                        title: {
                          text: 'С этим товаром часто покупают',
                          align: 'center',
                          theme: 'normal',
                          size: '700',
                        },
                        margins: {
                          top: '7',
                          bottom: '7',
                        },
                      },
                      props: {
                        subtitle: {
                          type: 'default',
                        },
                        titleParams: {
                          size: 'm',
                          type: 'default',
                        },
                        paddingTop: 'none',
                        paddingBottom: 'none',
                        paddingLeft: 'none',
                        paddingRight: 'none',
                        theme: 'light',
                        titleStyle: 'default',
                        compensateSideMargin: false,
                        size: 'm',
                        ratio: [
                          1,
                          6,
                        ],
                        showControls: true,
                        controlsSize: 'm',
                        align: 'top',
                        horizontalAlign: 'left',
                        minCountToShow: 0,
                        deduplicate: false,
                        clickableTitle: false,
                        withSeparator: false,
                        adaptiveLayout: false,
                        isAdult: false,
                      },
                    },
                  },
                  id: 95034864,
                  name: 'SkuComplementaryProducts',
                  entity: 'widget',
                },
              ],
            },
            name: 'GroupOfWidgets',
            otherCmsOptions: {
              loadMode: 'lazy',
              entity: 'widget',
              placeholder: 'SnippetScrollbox',
            },
          },
          slotOptions: {},
        },
      ],
      path: window.location.pathname,
    };

    const res = await fetch(API, {
      headers: {
        sk,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const html = await res.text();
    const div = document.createElement('div');
    div.id = 'added-pdp';
    div.innerHTML = html;
    document.body.append(div);
  }
  async function getProductId () {
    return document.querySelector('[data-zone-data*="productId"]').getAttribute('data-zonedata').match(/"productId":(\d+)/)[1];
  };
  try {
    const productId = await context.evaluate(getProductId);
    await context.evaluate(addPDP, productId);
  } catch (error) {
    console.log('Error adding PDP. Error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
