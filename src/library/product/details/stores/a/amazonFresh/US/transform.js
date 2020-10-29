/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '');

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.asin && row.asin[0]) {
          row.asin = [{ text: row.asin[0].text.match(/([A-Za-z0-9]{10,})/g)[0] }];
        }
        if (row.warnings && row.warnings[0]) {
          row.warnings = [{ text: row.warnings[0].text.replace(/Safety Information/g, '').trim() }];
        }
        if (row.weightGross && row.weightGross[0]) {
          if (row.weightGross[0].text.includes(';')) {
            row.weightGross[0].text = row.weightGross[0].text.split(';')[1];
          }
          row.weightGross = [{ text: row.weightGross[0].text.trim() }];
        }
        if (row.shippingWeight && row.shippingWeight[0]) {
          if (row.shippingWeight[0].text.includes(';')) {
            row.shippingWeight[0].text = row.shippingWeight[0].text.split(';')[1];
          }
          row.shippingWeight = [{ text: row.shippingWeight[0].text.replace(/\s\(/g, '').trim() }];
        }
        if (row.grossWeight && row.grossWeight[0]) {
          row.grossWeight = [{ text: row.grossWeight[0].text.replace(/\s\(/g, '').trim() }];
        }
        if (row.largeImageCount && row.largeImageCount[0]) {
          const count = row.largeImageCount[0].text.toString().split('SL1500') ? (row.largeImageCount[0].text.toString().split('SL1500').length - 1) : null;
          if (count) {
            row.largeImageCount = [{ text: count }];
          } else {
            row.largeImageCount = [{ text: '0' }];
          }
        }
        if (row.alternateImages) {
          if (row.alternateImages.length > 0) {
            const images = [];
            row.alternateImages.forEach(image => {
              images.push(image.text);
            });
            row.alternateImages = [{ text: images.join(' | ').trim().replace(/\| \|/g, '|') }];
          } else {
            row.alternateImages = [{ text: '' }];
          }
        }
        if (row.videos && row.videos[0]) {
          const regex = /\"url\":\"([^"]+)/g;
          const rawArray = row.videos[0].text.toString().match(regex);
          const videos = [];
          if (rawArray) {
            rawArray.forEach(item => {
              const regex2 = /(https.+mp4)/s;
              videos.push(item.match(regex2)[0]);
            });
            row.videos = [{ text: videos.join(' | ').trim().replace(/\| \|/g, '|') }];
          } else {
            row.videos = [{ text: '' }];
          }
        }
        if (row.videoLength && row.videoLength[0]) {
          const regex1 = /\"durationTimestamp\":\"([^"]+)/g;
          const rawArray = row.videoLength[0].text.toString().match(regex1);
          const videos = [];
          if (rawArray) {
            rawArray.forEach(item => {
              const regex2 = /([0-9\:]{3,})/s;
              videos.push(item.match(regex2)[0]);
            });
            row.videoLength = [{ text: videos.join(' | ').trim().replace(/\| \|/g, '|') }];
          } else {
            row.videoLength = [{ text: '' }];
          }
        }
        if (row.brandLink && row.brandLink[0]) {
          if (!row.brandLink[0].text.includes('www.amazon.com')) {
            row.brandLink = [{ text: `https://www.amazon.com${row.brandLink[0].text}` }];
          } else {
            row.brandLink = [{ text: row.brandLink[0].text }];
          }
        }
        if (row.brandText && row.brandText[0]) {
          console.log('1row.brandText');
          console.log(row.brandText);
          const regexBrand = /([B|b]rand:)|(^[B|b]y)|([B|b]rand)|([V|v]isit the)|([S|s]tore)/gm;
          if (regexBrand.test(row.brandText[0].text)) {
            const brandName = (row.brandText[0].text).replace(regexBrand, '').trim();
            console.log(brandName);
            row.brandText = [{ text: brandName }];
          }
        }
        if (row.name && row.name[0]) {
          const regexIgnore = /(Amazon.com\s*:)/;
          if (regexIgnore.test(row.name[0].text)) {
            row.name = [{ text: row.name[0].text.replace(/(Amazon.com\s*:)/, '') }];
          }
        }
        if (row.pricePerUnit) {
          const regexBraces = /[{()}]/g;
          const regexBeforeSlash = /([^\/]+$)/g;
          const regexIgnoreSlash = /[\/].*$/g;
          row.pricePerUnit.forEach(item => {
            if (regexBraces.test(item.text)) {
              item.text = (item.text).toString().replace(regexBraces, '');
              console.log('item.text');
              console.log(item.text);
              // item.text = regexBeforeSlash.exec(item.text);
              item.text = (item.text).toString().replace(regexIgnoreSlash, '');
            }
          });
          // const priceUnit = row.pricePerUnit[0].text.replace(regexBraces, '').exec(regexBeforeSlash).replace(regexIgnoreSlash, '');

          // row.pricePerUnitUom = [{ text: priceUnit}];
        }
        if (row.pricePerUnitUom) {
          const regexBraces = /[{()}]/g;
          const regexAfterSlash = /([^\/]+$)/g;
          // const regexOnlyAlpha = /[A-Za-z]
          row.pricePerUnitUom.forEach(item => {
            console.log('row.pricePerUnitUom');
            console.log(item.text);
            if (regexBraces.test(item.text)) {
              item.text = item.text.replace(regexBraces, '');
              item.text = item.text.match(regexAfterSlash) ? item.text.match(regexAfterSlash)[0] : item.text;
            }
          });

          // const priceUOM = row.pricePerUnitUom[0].text.replace(regexBraces, '').exec(regexAfterSlash);

          // row.pricePerUnitUom = [{ text: priceUOM}];
        }
        if ((!(row.quantity && row.quantity[0] && row.quantity[0].text)) && (row.nameExtended && row.nameExtended[0] && row.nameExtended[0].text)) {
          const quantityText = row.nameExtended[0].text;
          const quantityRe = /(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|[oO]unce|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[s,S]ingle-serve K-Cup|[wW]ipe[s]?).?)(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|[oO]unce|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[s,S]ingle-serve K-Cup|[wW]ipe[s]?).?\s)*/;
          const packQuantityRe = /([(]Pack of \d*[)])/;
          const quantity = quantityRe.test(quantityText) ? quantityRe.exec(quantityText) : '';
          const packText = packQuantityRe.test(quantityText) ? packQuantityRe.exec(quantityText) : '';
          if (quantity && quantity !== undefined && quantity[0]) {
            row.quantity = [{ text: quantity[0].trim() }];
          }

          if (quantity == null || quantity === undefined) {
            row.quantity = [{ text: '' }];
          }

          if (packText.length && packText[0]) {
            if (row.quantity && row.quantity[0] && row.quantity[0].text.length) {
              row.quantity[0].text += ' ' + packText[0];
            } else {
              row.quantity = [{ text: packText[0] }];
            }
            // row.quantity[0].text += row.quantity[0].text.length ? ' ' + packText[0] : packText[0];
          }
        }
        if (row.variantAsins) {
          let asins = [];
          // row.variantAsins.forEach(item => {
          //   if (item.text.match(/([A-Za-z0-9]{8,})/g)) {
          //     asins.push(item.text.match(/([A-Za-z0-9]{8,})/g)[0]);
          //   }
          // });

          if (row.variantAsins[0]) {
            if ((row.variantAsins[0].text.includes('asinVariationValues') && (row.variantAsins[0].text.includes('dimensionValuesData')))) {
              let jsonStr = row.variantAsins[0].text.split('"asinVariationValues" : ')[1].split('"dimensionValuesData" : ')[0];
              // let jsonStr = row.variantAsins[0].text.split('"asinVariationValues" : ');
              // jsonStr = jsonStr.length >= 1 ? jsonStr[1].split('"dimensionValuesData" : ') : '';
              // jsonStr = jsonStr.length ? jsonStr[0] : '';
              jsonStr = jsonStr.slice(0, -2);
              const jsonObj = JSON.parse(jsonStr);
              asins = Object.keys(jsonObj);
            } else {
              asins = [];
            }
          }
          // @ts-ignore
          const dedupeAsins = [...new Set(asins)];
          row.variantAsins = [
            {
              text: dedupeAsins.join(' | ').trim().replace(/\| \|/g, '|'),
            },
          ];
        }
        // if (row.variantCount) {
        //   let asins = [];
        //   row.variantCount.forEach(item => {
        //     if (item.text) {
        //       asins.push(item.text);
        //     }
        //   });
        //   // @ts-ignore
        //   const dedupeAsins = [...new Set(asins)];
        //   row.variantCount = [
        //     {
        //       text: dedupeAsins.length,
        //     },
        //   ];
        // }
        if (row.variantCount && row.variantCount[0]) {
          if (typeof row.variantCount[0].text !== 'number' && (row.variants && row.variants[0])) {
            if ((row.variantCount[0].text.includes('asinVariationValues') && (row.variantCount[0].text.includes('dimensionValuesData')))) {
              let jsonStr = row.variantCount[0].text.split('"asinVariationValues" : ')[1].split('"dimensionValuesData" : ')[0];
              jsonStr = jsonStr.slice(0, -2);
              // let jsonStr = row.variantAsins[0].text.split('"asinVariationValues" : ');
              // jsonStr = jsonStr.length >= 1 ? jsonStr[1].split('"dimensionValuesData" : ') : '';
              // jsonStr = jsonStr.length ? jsonStr[0] : '';
              // jsonStr = jsonStr.slice(0, -2);
              const jsonObj = JSON.parse(jsonStr);
              row.variantCount = [
                {
                  text: Object.keys(jsonObj).length,
                },
              ];
            }
          } else {
            row.variantCount = [
              {
                text: '1',
              },
            ];
          }
        } else {
          row.variantCount = [
            {
              text: '1',
            },
          ];
        }

        if (row.variants) {
          const asins = [];
          row.variants.forEach(item => {
            if (item.text) {
              asins.push(item.text);
            }
          });
          // @ts-ignore
          const dedupeAsins = [...new Set(asins)];
          row.variants = [
            {
              text: dedupeAsins,
            },
          ];
        }
        if (row.salesRankCategory) {
          const rankCat = [];
          row.salesRankCategory.forEach(item => {
            if (item.text.includes('#')) {
              const regex = /\#[0-9,]{1,} in (.+) \(/s;
              const rawCat = item.text.match(regex);
              rankCat.push(
                {
                  text: rawCat[1] ? rawCat[1] : '',
                },
              );
            } else {
              rankCat.push(
                {
                  text: item.text,
                },
              );
            }
          });
          row.salesRankCategory = rankCat;
        }
        if (row.salesRank) {
          const rank = [];
          row.salesRank.forEach(item => {
            if (item.text.includes('#')) {
              const regex = /([0-9,]{1,})/s;
              const rawCat = item.text.match(regex);
              if (rawCat) {
                rank.push(
                  {
                    text: rawCat[0],
                  },
                );
              }
            } else {
              rank.push(
                {
                  text: '',
                },
              );
            }
          });
          row.salesRank = rank;
        }
        if (row.manufacturerDescription && row.manufacturerDescription) {
          const description = [];
          console.log('manufacturerDescription');
          console.log(row.manufacturerDescription);
          /*
          row.manufacturerDescription.forEach(item => {
            const regexIgnoreText = /(^(Read more))|((From the manufacturer))|(View larger)/gm;
            // console.log(item.text);
            item.text = (item.text).toString().replace(regexIgnoreText, '').replace(/<img[^>]*>/gm, '');
            // console.log(item.text);
            // if (!regexIgnoreText.test(item.text)) {
              description.push(item.text);
            // }
          });
          */
          row.manufacturerDescription.forEach(item => {
            const manufTitleIgnoreText = /((From the manufacturer))/gm;
            const regexIgnoreText = /(Read more)|(View larger)/gm;
            // console.log(item.text);
            item.text = (item.text).toString().replace(manufTitleIgnoreText, '').trim();
            console.log(item.text);
            item.text = (item.text).replace(regexIgnoreText, '').replace(/<img[^>]*>/gm, '');
            console.log(item.text);
            // if (!regexIgnoreText.test(item.text)) {
            // }
          });

          row.manufacturerDescription = [
            {
              text: row.manufacturerDescription[0].text.trim(),
            },
          ];
        }
        if (row.heroQuickPromoUrl && row.heroQuickPromoUrl[0]) {
          if (row.heroQuickPromoUrl[0].text.includes('http')) {
            row.heroQuickPromoUrl = [{ text: row.heroQuickPromoUrl[0].text }];
          } else {
            row.heroQuickPromoUrl = [{ text: 'https://www.amazon.com/' + row.heroQuickPromoUrl[0].text }];
          }
        }
        if (row.description) {
          // row.description = [{ text: row.description[0].text.replace(/\n \n/g, ' || ') }];
          const text = [''];
          // for (let i = 0; i < row.description.length; i++) {
          //   const item = row.description[i];
          //   if (item.text.includes('Product description')) {
          //     break;
          //   }
          //   text.push(item.text);
          // }
          row.description.forEach(item => {
            text.push(item.text);
          });
          // console.log('row.description')
          // console.log(text)
          const index = text.indexOf('Product description');
          let fullDescriptionArr = [];
          if (index !== -1) {
            fullDescriptionArr = text.splice(index);
            fullDescriptionArr.shift();
          }
          row.description = [{ text: text.join(' || ').trim().replace(/\|\| \|/g, '|') + ' ' + fullDescriptionArr.join(' ') }];
          // row.description[0].text = row.description[0].text.startsWith('|| ') ? row.description[0].text.slice(2) : row.description[0].text;
        }
        if (row.amazonChoice && row.amazonChoice[0]) {
          if (row.amazonChoice[0].text.includes('Amazon')) {
            row.amazonChoice = [
              {
                text: 'Yes',
              },
            ];
          } else {
            row.amazonChoice = [
              {
                text: 'No',
              },
            ];
          }
        }
        if (row.specifications) {
          const text = [];
          row.specifications.forEach(item => {
            text.push(`${item.text.replace(/\n \n/g, ':')}`);
          });
          row.specifications = [
            {
              text: text.join(' || ').trim().replace(/\|\| \|/g, '|'),
            },
          ];
        }
        if (row.productOtherInformation) {
          const text = [];
          row.productOtherInformation.forEach(item => {
            text.push(item.text);
          });
          if (text.length > 0) {
            row.productOtherInformation = [
              {
                text: text.join(' | ').trim().replace(/\| \|/g, '|'),
              },
            ];
          }
        }
        if (row.additionalDescBulletInfo) {
          const text = [''];
          row.additionalDescBulletInfo.forEach(item => {
            if (item.text.length > 0) { text.push(item.text); }
          });
          if (text.length > 0) {
            row.additionalDescBulletInfo = [
              {
                text: text.join(' || ').trim().replace(/\|\| \|/g, '|'),
              },
            ];
          }
          // row.additionalDescBulletInfo.forEach(item => {
          //   if (item.text.length > 0) {
          //     item.text = item.text.startsWith(' || ') ? item.text : ' || ' + item.text;
          //   }
          // });
        }
        if (row.otherSellersPrime) {
          row.otherSellersPrime.forEach(item => {
            if (item.text.includes('mazon') || item.text.includes('rime')) {
              item.text = 'YES';
            } else {
              item.text = 'NO';
            }
          });
        }
        if (row.availabilityText && row.availabilityText[0]) {
          row.availabilityText = [
            {
              text: /[Ii]n [Ss]tock/gm.test(row.availabilityText[0].text) ? 'In stock' : row.availabilityText[0].text,
            },
          ];
        }
        if (row.otherSellersShipping2) {
          row.otherSellersShipping2.forEach(item => {
            if (item.text.includes('ree') || item.text.includes('REE')) {
              item.text = '0.00';
            } else if (item.text.includes('+ $')) {
              const regex = /\$([0-9\.]{3,})/s;
              item.text = item.text.match(regex)[1];
            } else {
              item.text = '0.00';
            }
          });
        }
        if (row.featureBullets) {
          const text = [];
          row.featureBullets.forEach(item => {
            text.push(`${item.text}`);
          });
          row.featureBullets = [
            {
              text: text.join(' || ').trim().replace(/\|\| \|/g, '|'),
            },
          ];
        }
        if (row.primeFlag) {
          row.primeFlag = [{ text: 'Yes' }];
        }
        if (row.ingredientsList) {
          const text = [];
          row.ingredientsList.forEach(item => {
            text.push(`${item.text}`);
          });
          row.ingredientsList = [
            {
              text: text.join(' '),
            },
          ];
        }
        if (row.promotion) {
          const text = [];
          row.promotion.forEach(item => {
            text.push(`${item.text}`);
          });
          row.promotion = [
            {
              text: text.join(' '),
            },
          ];
        }
        if (row.shippingDimensions && row.shippingDimensions[0]) {
          if (row.shippingDimensions[0].text.includes(';')) {
            row.shippingDimensions[0].text = row.shippingDimensions[0].text.split(';')[0];
          }
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
