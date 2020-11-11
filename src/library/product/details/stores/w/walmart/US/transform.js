/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/(<([^>]+)>)/ig, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  const regexp = '(?:(<?\\s?[\\d\\.]+)\\s?(\\w*))';
  function getSplitValue (inputStr, count) {
    if (inputStr) {
      const result = inputStr.match(regexp);
      if (result && count <= result.length) { return result[count]; } else { return inputStr; }
    }
  }
  function getValue (name, obj) {
    if (obj.values && obj.values.length > 0) {
      for (let i = 0; i < obj.values.length; i++) {
        if (obj.values[i].mainNutrient && obj.values[i].mainNutrient.name && obj.values[i].mainNutrient.name.includes(name)) {
          return obj.values[i];
        }
      }
    }
  }

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.asin) {
          row.asin = [{ text: row.asin[0].text.replace('Walmart', '').replace('#', '').trim() }];
        }
        if (row.variantIdOverRide) {
          const id = row.variantIdOverRide[0].text.split('/').slice(-1)[0];
          row.variantId = [{ text: `${id}` }];
        }
        if (row.variantId) {
          row.productUrl = [{ text: `https://www.walmart.com/ip/${row.variantId[0].text}` }];
        }
        if (row.lbb) {
          if (!row.otherSellersName || (row.otherSellersName && row.otherSellersName.length < 2)) {
            row.lbb = [{ text: 'No' }];
          } else if (row.otherSellersName && row.otherSellersPrice) {
            if (!row.otherSellersName.map(item => item.text).join(' ').includes('Walmart')) {
              row.lbb = [{ text: 'No' }];
            } else {
            // check if Walmart has lowest price || fastest shipping, 'No' if so, otherwise 'Yes'
              const walmartIdx = row.otherSellersName.map(item => item.text).indexOf('Walmart');
              const allPrices = row.otherSellersPrice.map(item => parseFloat(item.text.replace('$', '')));

              const walmartPrice = allPrices[walmartIdx];
              const walmartisNotLowest = (Math.min(...allPrices) !== walmartPrice) ? 'Yes' : 'No';

              row.lbb = [{ text: walmartisNotLowest }];
              if (walmartisNotLowest === 'Yes') {
                row.lbbPrice = [{ text: Math.min(...allPrices) }];
              }
            }
          } else if (row.price) {
            row.lbb = [{ text: 'Yes' }];
            row.lbbPrice = [{ text: row.price[0].text.trim() }];
          }
        } else if (!row.otherSellersName || (row.otherSellersName && row.otherSellersName.length < 2)) {
          row.lbb = [{ text: 'No' }];
        }

        // if (row.lbb && row.lbb[0].text.includes('Yes') && row.price) {
        //   row.lbbPrice = [{ text: row.price[0].text.trim() }];
        // }
        if (row.shippingInfo && row.shippingInfo[0].text !== '') {
          row.shippingInfo = [{ text: row.shippingInfo[0].text.trim().replace('Walmart.com', 'Walmart') }];
        } else
        if (row.shippingInfo1) {
          row.shippingInfo = [{ text: row.shippingInfo1[0].text.replace('"sellerDisplayName":"', '').replace('","showSold', '').replace('Walmart.com', 'Walmart') }];
        }
        if (row.shippingInfo && (!row.otherSellersName || (row.otherSellersName && row.otherSellersName[0].text !== 'Walmart' && !row.otherSellersName[0].text.includes(row.shippingInfo[0].text)))) {
          if (row.otherSellersName && row.otherSellersName.length > 0) {
            row.otherSellersName.unshift({ text: row.shippingInfo[0].text.trim() });
          } else {
            row.otherSellersName = [{ text: row.shippingInfo[0].text.trim() }];
          }
          if (row.price) {
            if (row.otherSellersPrice && row.otherSellersPrice.length > 0) {
              row.otherSellersPrice.unshift({ text: row.price[0].text.trim() });
            } else {
              row.otherSellersPrice = [{ text: row.price[0].text.trim() }];
            }
          }
          if (row.shippingPrice) {
            if (row.otherSellersShipping2 && row.otherSellersShipping2.length > 0) {
              row.otherSellersShipping2.unshift({ text: row.shippingPrice[0].text.trim() });
            } else {
              row.otherSellersShipping2 = [{ text: row.shippingPrice[0].text.trim() }];
            }
          }
        }
        if (row.otherSellersShipping2) {
          row.otherSellersShipping2.forEach(item => {
            item.text = item.text.split('$').length > 1 ? item.text.split('$')[1] : item.text;
            item.text = item.text.replace('Free', '0').replace(' delivery', '').replace('0.00', '0').replace('0', '0.00');
          });
        }
        if (row.description) {
          row.description = [{
            text: row.description[0].text.replace(/^\s*[\r\n]/gm, ' || ').replace('•', '').split('%3C')[0],
            // text: row.description[0].text.replace(/^\s*[\r\n]/gm, '').replace('•', '|| ').split('%3C')[0].trim(),
          }];

          if (row.description[0].text.includes('Specifications')) {
            row.Specifications = [{ text: row.description[0].text.split('Specifications')[1].replace(' || ', '') }];
          }
        }

        if (row.descriptionBullets && row.descriptionBullets[0].text === '0') {
          row.descriptionBullets = [{ text: '' }];
        }

        if (row.promotion) {
          const promotionsWithoutRollback = [];

          row.promotion.forEach(promoText => {
            if (promoText.text !== 'ROLLBACK') {
              promotionsWithoutRollback.push(promoText.text);
            }
          });
          row.promotion = [{ text: promotionsWithoutRollback }];
        }

        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }

        if ((row.price && row.price[0].text === '0') || (!row.price) || (row.unavailableMsg) || (row.outOfStockMsg)) {
          row.availabilityText = [{ text: 'Out of Stock' }];
        } else if (row.availabilityMessage && row.availabilityMessage[0].text.includes('in-store')) {
          row.availabilityText = [{ text: 'In stores only' }];
        } else {
          row.availabilityText = [{ text: 'In Stock' }];
        }

        if (row.price && row.price[0].text === '0') {
          delete row.price;
        }

        if (row.variantInformation) {
          let text = '';
          row.variantInformation.forEach(item => {
            // eslint-disable-next-line no-control-regex
            const splits = item.text.replace(/\\"/g, '').replace('}', '').split(':');
            text += `${splits[splits.length - 1].replace('actual_color-', '')} | `;
          });
          row.variantInformation = [
            {
              text: text.replace(/"/g, '').slice(0, -3),
            },
          ];
        }

        if (row.videos) {
          const noDups = new Set();
          row.videos.forEach(vid => {
            if (vid.text) {
              noDups.add(vid.text);
            }
          });
          const arr = Array.from(noDups);
          row.videos = [{ text: arr.join(' | ') }];
        }

        if (row.firstVariant) {
          row.firstVariant = [{ text: row.firstVariant[0].text.replace('"primaryProductId":"', '').replace('","primary', '') }];
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            if (!item.text.match('https://') && item.text.startsWith('//')) {
              item.text = `https:${item.text}`;
            }
            if (item.text.includes('?')) {
              const endIdx = item.text.indexOf('?');
              item.text = item.text.slice(0, endIdx);
            }
          });
        }
        if (row.nutritionInfo) {
          const jsonStr = `{${row.nutritionInfo[0].text}}`;
          if (jsonStr) {
            const info = JSON.parse(jsonStr);
            console.log(JSON.stringify(info));
            if (info && info.nutritionFacts && info.nutritionFacts.servingInfo && info.nutritionFacts.servingInfo.values) {
              const servingSize = (info.nutritionFacts.servingInfo.values[0]) ? info.nutritionFacts.servingInfo.values[0].value : '';
              row.servingSize = [{ text: getSplitValue(servingSize, 1) }];
              row.servingSizeUom = [{ text: getSplitValue(servingSize, 2) }];
              row.numberOfServingsInPackage = [{ text: (info.nutritionFacts.servingInfo.values[1]) ? info.nutritionFacts.servingInfo.values[1].value : '' }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.calorieInfo) {
              row.caloriesPerServing = [{ text: (info.nutritionFacts.calorieInfo.mainNutrient && info.nutritionFacts.calorieInfo.mainNutrient.amount) ? info.nutritionFacts.calorieInfo.mainNutrient.amount.split(' ')[0].replace('cal', '') : '' }];
              row.caloriesFromFatPerServing = [{ text: (info.nutritionFacts.calorieInfo.childNutrients && info.nutritionFacts.calorieInfo.childNutrients[0] && info.nutritionFacts.calorieInfo.childNutrients[0].amount) ? info.nutritionFacts.calorieInfo.childNutrients[0].amount.split(' ')[0].replace('cal', '') : '' }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.keyNutrients && info.nutritionFacts.keyNutrients.values) {
              let valueNode = getValue('Total Fat', info.nutritionFacts.keyNutrients);
              const totalFatPerServing = valueNode ? valueNode.mainNutrient.amount : '';
              row.totalFatPerServing = [{ text: getSplitValue(totalFatPerServing, 1) }];
              row.totalFatPerServingUom = [{ text: getSplitValue(totalFatPerServing, 2) }];

              const saturatedFatPerServing = (valueNode && valueNode.childNutrients) ? valueNode.childNutrients[0].amount : '';
              row.saturatedFatPerServing = [{ text: getSplitValue(saturatedFatPerServing, 1) }];
              row.saturatedFatPerServingUom = [{ text: getSplitValue(saturatedFatPerServing, 2) }];

              const transFatPerServing = (valueNode && valueNode.childNutrients && valueNode.childNutrients.length > 1) ? valueNode.childNutrients[1].amount : '';
              row.transFatPerServing = [{ text: getSplitValue(transFatPerServing, 1) }];
              row.transFatPerServingUom = [{ text: getSplitValue(transFatPerServing, 2) }];

              valueNode = getValue('Cholesterol', info.nutritionFacts.keyNutrients);
              const cholesterolPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.cholesterolPerServing = [{ text: getSplitValue(cholesterolPerServing, 1) }];
              row.cholesterolPerServingUom = [{ text: getSplitValue(cholesterolPerServing, 2) }];

              valueNode = getValue('Sodium', info.nutritionFacts.keyNutrients);
              const sodiumPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.sodiumPerServing = [{ text: getSplitValue(sodiumPerServing, 1) }];
              row.sodiumPerServingUom = [{ text: getSplitValue(sodiumPerServing, 2) }];

              valueNode = getValue('Carbohydrate', info.nutritionFacts.keyNutrients);
              const totalCarbPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.totalCarbPerServing = [{ text: getSplitValue(totalCarbPerServing, 1) }];
              row.totalCarbPerServingUom = [{ text: getSplitValue(totalCarbPerServing, 2) }];

              const dietaryFibrePerServing = (valueNode && valueNode.childNutrients) ? valueNode.childNutrients[0].amount : '';
              row.dietaryFibrePerServing = [{ text: getSplitValue(dietaryFibrePerServing, 1) }];
              row.dietaryFibrePerServingUom = [{ text: getSplitValue(dietaryFibrePerServing, 2) }];

              const totalSugarsPerServing = (valueNode && valueNode.childNutrients && valueNode.childNutrients.length > 1) ? valueNode.childNutrients[1].amount : '';
              row.totalSugarsPerServing = [{ text: getSplitValue(totalSugarsPerServing, 1) }];
              row.totalSugarsPerServingUom = [{ text: getSplitValue(totalSugarsPerServing, 2) }];

              valueNode = getValue('Protein', info.nutritionFacts.keyNutrients);
              const proteinPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.proteinPerServing = [{ text: getSplitValue(proteinPerServing, 1) }];
              row.proteinPerServingUom = [{ text: getSplitValue(proteinPerServing, 2) }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.vitaminMinerals && info.nutritionFacts.vitaminMinerals.childNutrients) {
              let valueNode = info.nutritionFacts.vitaminMinerals.childNutrients[0];
              if (valueNode) {
                row.vitaminAPerServing = [{ text: getSplitValue(valueNode.dvp, 1) }];
                row.vitaminAPerServingUom = [{ text: getSplitValue(valueNode.dvp, 2) }];
              }
              valueNode = info.nutritionFacts.vitaminMinerals.childNutrients[1];
              if (valueNode) {
                row.vitaminCPerServing = [{ text: getSplitValue(valueNode.dvp, 1) }];
                row.vitaminCPerServingUom = [{ text: getSplitValue(valueNode.dvp, 2) }];
              }
              valueNode = info.nutritionFacts.vitaminMinerals.childNutrients[2];
              if (valueNode) {
                row.calciumPerServing = [{ text: getSplitValue(valueNode.dvp, 1) }];
                row.calciumPerServingUom = [{ text: getSplitValue(valueNode.dvp, 2) }];
              }
              valueNode = info.nutritionFacts.vitaminMinerals.childNutrients[3];
              if (valueNode) {
                row.ironPerServing = [{ text: getSplitValue(valueNode.dvp, 1) }];
                row.ironPerServingUom = [{ text: getSplitValue(valueNode.dvp, 2) }];
              }
            }
          }
        }

        if (!row.nutritionInfo && row.carbsPerServing) {
          const carbs = row.carbsPerServing[0].text;
          row.totalCarbPerServing = [{ text: carbs.replace(/[^\d]/g, '') }];
          row.totalCarbPerServingUom = [{ text: carbs.replace(/[^a-zA-Z]/g, '') }];
        }

        if (!row.aggregateRating && row.agRatingFromPage) {
          row.aggregateRating = [{ text: row.agRatingFromPage[0].text }];
          delete row.agRatingFromPage;
        }

        if (!row.manufacturerImages && row.manufacturerImagesFromPage) {
          row.manufacturerImages = [{ text: row.manufacturerImagesFromPage[0].text }];
          delete row.manufacturerImagesFromPage;
        }

        if (!row.manufacturerDescription && row.myEnhancedContent) {
          row.manufacturerDescription = [{ text: row.myEnhancedContent[0].text }];
          delete row.myEnhancedContent;
        }

        if (row.manufacturerDescription) {
          // remove json if present
          const rawText = row.manufacturerDescription[0].text;
          row.manufacturerDescription = [{ text: rawText.replace(/{.*}/g, '') }];
        }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = el.text ? clean(el.text) : el.text;
        }));
      } catch (exception) { console.log('Error in transform', exception); }
      try {
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = el.text ? clean(el.text) : el.text;
        }));
      } catch (exception) { console.log('Error in cleanup transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
