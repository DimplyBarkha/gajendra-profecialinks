const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    transform,
    domain: 'casinodrive.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    try {
      const basicDetails = await context.evaluate(() => {
        let gotoUrl = '';
        const script = document.querySelector('body > script');
        if (script && script.textContent.indexOf('id="alk-product-page"')) {
          const startIndex = script.textContent.indexOf('<iframe');
          const endIndex = script.textContent.indexOf('/iframe>') + '/iframe>'.length;
          const iframeStr = script.textContent.substring(startIndex, endIndex);
          const tokens = iframeStr.split(' ');
          for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].startsWith('src="')) {
              gotoUrl = `https:${tokens[i].substring((tokens[i].indexOf('"') + 1), (tokens[i].length - 1))}`;
              gotoUrl = gotoUrl.replace(/&amp;/g, '&');
            }
          }
        }

        const name = document.querySelector('section[class="tagClick "] div[class="title"]').textContent;
        const price = document.querySelector('div[class="inner"] div[itemprop="price"]').textContent;
        const productUrl = window.location.href;

        const addToCart = document.querySelectorAll('div[class="inner"] a[id*="addProduct"]');
        let availabilityText = 'Out of Stock';
        if (addToCart) {
          for (let i = 0; i < addToCart.length; i++) {
            const addToCartTitle = addToCart[i].getAttribute('title');
            if (addToCartTitle && addToCartTitle === 'Ajouter au panier') {
              availabilityText = 'In Stock';
              break;
            }
          }
        }

        return { gotoUrl, name, price, availabilityText, productUrl };
      });

      if (basicDetails.gotoUrl) {
        await context.setBlockAds(false);
        await context.setLoadAllResources(true);
        await context.setLoadImages(true);
        await context.setJavaScriptEnabled(true);
        await context.setAntiFingerprint(false);
        await context.goto(basicDetails.gotoUrl, {
          firstRequestTimeout: 60000,
          timeout: 10000,
          waitUntil: 'load',
          checkBlocked: false,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 10000));

      await context.evaluate(basicDetails => {
        const addHiddenDiv = (id, content) => {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        };

        if (basicDetails.name) {
          addHiddenDiv('ii_name', basicDetails.name);
        }
        if (basicDetails.price) {
          addHiddenDiv('ii_price', basicDetails.price);
        }
        if (basicDetails.availabilityText) {
          addHiddenDiv('ii_availabilityText', basicDetails.availabilityText);
        }
        if (basicDetails.productUrl) {
          addHiddenDiv('ii_productUrl', basicDetails.productUrl);
        }

        const imageList = document.querySelectorAll('div[class="ProductPictures"] ul[class*="slider"] li');
        if (imageList && imageList.length > 0) {
          const alternateImages = [];
          imageList.forEach((item, index) => {
            const image = item.querySelector('img');
            const imageUrl = image.getAttribute('src');
            if (index === 0) {
              addHiddenDiv('ii_image', imageUrl);
            } else {
              alternateImages.push(imageUrl);
            }
          });
          addHiddenDiv('ii_alternateImages', alternateImages.join(' | '));
        }

        const dietarySymbolElements = document.querySelectorAll('div[class="Labels"] div[class="Label"]');
        if (dietarySymbolElements && dietarySymbolElements.length > 0) {
          const dietarySymbols = [];
          dietarySymbolElements.forEach(item => {
            dietarySymbols.push(item.getAttribute('data-tip'));
          });
          addHiddenDiv('ii_dietarySymbols', dietarySymbols.join(' '));
        }

        if (basicDetails.gotoUrl && basicDetails.gotoUrl.indexOf('productinshop_shortidinternal') >= 0) {
          const queryParamsStr = basicDetails.gotoUrl.split('?')[1];
          const queryParams = queryParamsStr.split('&');
          for (let i = 0; i < queryParams.length; i++) {
            const nameValuePair = queryParams[i].split('=');
            if (nameValuePair[0] === 'productinshop_shortidinternal') {
              addHiddenDiv('ii_variantId', nameValuePair[1]);
            }
          }
        }
        const description = [];
        const headers = document.querySelectorAll('div[class*="Header__column--right"] h2[class="HeaderTitle"]');
        if (headers) {
          headers.forEach(header => {
            if (header.textContent === 'Le produit') {
              const directionsPara = header.nextSibling;
              if (directionsPara) {
                description.push(directionsPara.textContent);
                addHiddenDiv('ii_directions', directionsPara.textContent);
              }
              const netWeightPara = header.nextSibling.nextSibling;
              if (netWeightPara && netWeightPara.textContent.indexOf('Quantité nette de') >= 0) {
                const netWeight = netWeightPara.textContent.split(':')[1].trim();
                addHiddenDiv('ii_netWeight', netWeight);
              }
            } else if (header.textContent === 'Description') {
              description.push(header.nextSibling.textContent);
            } else if (header.textContent === 'Origine') {
              const originPara = header.nextSibling;
              if (originPara) {
                addHiddenDiv('ii_countryOfOrigin', originPara.textContent);
              }
            }
          });
        }
        if (description.length > 0) {
          addHiddenDiv('ii_description', description.join(' '));
        }
      }, basicDetails);

      const tabTitles = await context.evaluate(() => {
        const titles = [];
        const tabTitleElements = document.querySelectorAll('div[class*="Tabs__tabWrapper"] div[class="Tab__label"]');
        tabTitleElements.forEach(tabTitleElement => {
          titles.push(tabTitleElement.textContent);
        });
        return titles;
      });

      const detailsIndex = tabTitles.findIndex(title => (title === 'Détails' || title === 'Bénéfices'));
      if (detailsIndex >= 0) {
        await context.click(`div[class*="Tabs__tabWrapper"]:nth-of-type(${detailsIndex + 1})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.evaluate(() => {
          const addHiddenDiv = (id, content) => {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          };

          const loadedTabContentTitles = document.querySelectorAll('div[class="Tab"] h3');
          if (loadedTabContentTitles) {
            loadedTabContentTitles.forEach(title => {
              let content = '';
              let sibling = title.nextSibling;
              let totalBulletPoints = 0;
              while (sibling) {
                if (title.textContent === 'Pourquoi utiliser ce produit ?') {
                  const htmlContent = sibling.innerHTML;
                  if (htmlContent.indexOf('<br>') > 0) {
                    const bulletPoints = htmlContent.split('<br>');
                    totalBulletPoints += bulletPoints.length;
                  }
                }
                content += ` ${sibling.textContent}`;
                sibling = sibling.nextSibling;
              }
              if (title.textContent === 'Pourquoi utiliser ce produit ?') {
                const description = document.querySelector('div[id="ii_description"]');
                if (description) {
                  description.textContent += content;
                } else {
                  addHiddenDiv('ii_description', content.trim());
                }
                if (totalBulletPoints) {
                  addHiddenDiv('ii_descriptionBullets', totalBulletPoints);
                }
              } else if (title.textContent === 'Qualités à ne pas oublier !') {
                addHiddenDiv('ii_productOtherInfo', content.trim());
              }
            });
          }
        });
      }

      const compositionIndex = tabTitles.findIndex(title => title === 'Composition');
      if (compositionIndex >= 0) {
        await context.click(`div[class*="Tabs__tabWrapper"]:nth-of-type(${compositionIndex + 1})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.evaluate(() => {
          const addHiddenDiv = (id, content) => {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          };

          const loadedTabContentTitles = document.querySelectorAll('div[class="Tab"] h3');
          if (loadedTabContentTitles) {
            loadedTabContentTitles.forEach(title => {
              if (title.textContent === 'Qu\'y a-t-il à l\'intérieur ?') {
                addHiddenDiv('ii_ingredients', title.nextSibling.textContent);
                const pattern = /sodium\s([0-9]+(,|.)[0-9]+)%/i;
                const result = title.nextSibling.textContent.match(pattern);
                if (result) {
                  const sodiumWithPercent = result[0].split(' ')[1];
                  addHiddenDiv('ii_sodiumPerServing', sodiumWithPercent.substring(0, sodiumWithPercent.length - 1));
                }
              } else if (title.textContent === 'Allergènes') {
                addHiddenDiv('ii_allergyAdvice', title.nextSibling.textContent);
              } else if (title.textContent === 'Additifs') {
                addHiddenDiv('ii_additives', title.nextSibling.textContent);
              }
            });
          }
        });
      }

      const nutritionIndex = tabTitles.findIndex(title => title === 'Nutrition');
      if (nutritionIndex >= 0) {
        await context.click(`div[class*="Tabs__tabWrapper"]:nth-of-type(${nutritionIndex + 1})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.evaluate(() => {
          const addHiddenDiv = (id, content) => {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          };

          const nutritionTable = document.querySelector('table[class="NutritionTable"]');
          if (nutritionTable) {
            const rows = nutritionTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
              const firstColValue = row.firstChild.textContent.trim();
              let valueWithUoM = '';
              if (firstColValue === 'energy value (kcal)') {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                addHiddenDiv('ii_caloriesPerServing', valueWithUoM);
              } else if (firstColValue === 'fats') {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_totalFatPerServing', values[0]);
                addHiddenDiv('ii_totalFatPerServingUom', values[1]);
              } else if (firstColValue.indexOf('dont saturated fats') >= 0) {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_saturatedFatPerServing', values[0]);
                addHiddenDiv('ii_saturatedFatPerServingUom', values[1]);
              } else if (firstColValue === 'carbohydrates') {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_totalCarbPerServing', values[0]);
                addHiddenDiv('ii_totalCarbPerServingUom', values[1]);
              } else if (firstColValue.indexOf('dont sugars') >= 0) {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_totalSugarsPerServing', values[0]);
                addHiddenDiv('ii_totalSugarsPerServingUom', values[1]);
              } else if (firstColValue === 'dietary fibers') {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_dietaryFibrePerServing', values[0]);
                addHiddenDiv('ii_dietaryFibrePerServingUom', values[1]);
              } else if (firstColValue === 'proteins') {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_proteinPerServing', values[0]);
                addHiddenDiv('ii_proteinPerServingUom', values[1]);
              } else if (firstColValue === 'salt') {
                valueWithUoM = row.firstChild.nextSibling.textContent.substring(1);
                const values = valueWithUoM.split(' ');
                addHiddenDiv('ii_saltPerServing', values[0]);
                addHiddenDiv('ii_saltPerServingUom', values[1]);
              }
            });
          }
        });
      }

      const manualIndex = tabTitles.findIndex(title => title === 'Mode d’emploi');
      if (manualIndex >= 0) {
        await context.click(`div[class*="Tabs__tabWrapper"]:nth-of-type(${manualIndex + 1})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.evaluate(() => {
          const addHiddenDiv = (id, content) => {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          };

          const loadedTabContentTitles = document.querySelectorAll('div[class="Tab"] h3');
          if (loadedTabContentTitles) {
            loadedTabContentTitles.forEach(title => {
              if (title.textContent === 'Conseils d\'utilisation') {
                const directions = document.querySelector('div[id="ii_directions"]');
                if (directions) {
                  directions.textContent = title.nextSibling.textContent;
                } else {
                  addHiddenDiv('ii_directions', title.nextSibling.textContent);
                }
                const description = document.querySelector('div[id="ii_description"]');
                if (description) {
                  description.textContent += ` ${title.nextSibling.textContent}`;
                } else {
                  addHiddenDiv('ii_description', title.nextSibling.textContent);
                }
              } else if (title.textContent === 'Avertissements légaux') {
                addHiddenDiv('ii_warnings', title.nextSibling.textContent);
              }
            });
          }
        });
      }

      const conservationIndex = tabTitles.findIndex(title => title === 'Conservation');
      if (conservationIndex >= 0) {
        await context.click(`div[class*="Tabs__tabWrapper"]:nth-of-type(${conservationIndex + 1})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.evaluate(() => {
          const addHiddenDiv = (id, content) => {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          };

          const loadedTabContentTitles = document.querySelectorAll('div[class="Tab"] h3');
          if (loadedTabContentTitles) {
            loadedTabContentTitles.forEach(title => {
              if (title.textContent === 'Conseils de conservation') {
                addHiddenDiv('ii_storage', title.nextSibling.textContent);
              }
            });
          }
        });
      }

      const expertiseIndex = tabTitles.findIndex(title => title === 'Expertise');
      if (expertiseIndex >= 0) {
        await context.click(`div[class*="Tabs__tabWrapper"]:nth-of-type(${expertiseIndex + 1})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await context.evaluate(() => {
          const addHiddenDiv = (id, content) => {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          };

          const loadedTabContentTitles = document.querySelectorAll('div[class="Tab"] h3');
          if (loadedTabContentTitles) {
            loadedTabContentTitles.forEach(title => {
              if (title.textContent === 'À propos de la marque') {
                addHiddenDiv('ii_brandText', title.nextSibling.textContent);
              }
            });
          }
        });
      }

      await context.click('div[class="ProductPictures"] li[class="slide selected"] img');
      await new Promise(resolve => setTimeout(resolve, 5000));
      await context.evaluate(() => {
        const addHiddenDiv = (id, content) => {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        };

        const zoomContainer = document.querySelector('div[class="ProductPicture--zoomContainer"]');
        const imageZoomPresent = (zoomContainer) ? 'Yes' : 'No';
        addHiddenDiv('ii_imageZoomFeaturePresent', imageZoomPresent);
      });
    } catch (err) {
      console.log('Something wrong to fetch product details page.');
    }

    return await context.extract(productDetails, { transform });
  },
};
