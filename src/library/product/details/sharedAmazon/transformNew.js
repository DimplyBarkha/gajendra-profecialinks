// @ts-nocheck
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
    // .replace(/"\s{1,}/g, '"')
    // .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .trim();

  const sg = item => item[0].text;
  const joinArray = (array, delim = ' | ') => array.join(delim).trim().replace(/\| \|/g, '|');

  const doubleRegexSearch = (regex1, regex2, item) => {
    const matchArray = sg(item).toString().match(regex1);
    if (!matchArray) return '';
    return joinArray(matchArray.map(mtch => mtch.match(regex2) ? mtch.match(regex2)[0] : ''));
  };

  const matchRegex = (regex, item, def = item) => {
    const match = item.match(regex);
    return match ? match[0] : def;
  };

  const regexTestNReplace = (regex, item, { extraRegex, matchRegex } = {}) => {
    if (regex.test(item)) {
      if (extraRegex) return item.toString().replace(regex, '').replace(extraRegex, '');
      if (matchRegex) return matchRegex(matchRegex, item.toString().replace(regex, ''));
      return item.toString().replace(regex, '');
    }
    return item;
  };

  const regexTestNReplaceArray = (regex, item, extraRegex) => item.map(value => regexTestNReplace(regex, value.text, extraRegex));

  const castToInt = (item, def = 0) => Number(item) || Number(item) === 0 ? parseInt(item) : def;

  for (const { group } of data) {
    for (const row of group) {
      const hostName = row.productUrl && row.productUrl[0] ? row.productUrl[0].text.split('/')[2] : '';
      const websiteName = hostName.split('.').slice(1).join('.');
      const mappingObject = {
        asin: item => matchRegex(/([A-Za-z0-9]{10,})/g, sg(item), ''),
        warnings: item => sg(item).replace(/Safety Information/g, '').trim(),
        weightGross: item => sg(item).trim(),
        shippingWeight: item => sg(item).replace(/\s\(/g, '').trim(),
        grossWeight: item => sg(item).replace(/\s\(/g, '').trim(),
        largeImageCount: item => {
          const array = sg(item).toString().split('SL1500');
          return array.length === 0 ? 0 : array.length - 1;
        },
        // alternateImages: array => joinArray(array.map(item => item.text)),
        videos: item => doubleRegexSearch(/"url":"([^"]+)/g, /(https.+mp4)/s, item),
        videoLength: item => doubleRegexSearch(/"durationTimestamp":"([^"]+)/g, /([0-9:]{3,})/s, item),
        brandLink: item => {
          if (!sg(item).includes(hostName)) return `https://${hostName}${sg(item)}`;
          return sg(item);
        },
        brandText: item => {
          let txt = regexTestNReplace(/([B|b]rand:)|([B|b]y)|([B|b]rand)|([V|v]isit the)/gm, sg(item));
          if (txt.includes('Dyson Store')) txt = 'Dyson';
          return txt.trim();
        },
        name: item => regexTestNReplace(new RegExp(String.raw`(${websiteName.replace(/\./g, '\\.')}\s*:)`), sg(item)),
        pricePerUnit: item => regexTestNReplaceArray(/[{()}]/g, item, { extraRegex: /[/].*$/g }),
        pricePerUnitUom: item => regexTestNReplaceArray(/[{()}]/g, item, { matchRegex: /([^/]+$)/g }),
        secondaryImageTotal: item => castToInt(sg(item)),
        ratingCount: item => sg(item),
        color: item => sg(item),
        descriptionBullets: item => castToInt(sg(item)),
        shippingInfo: array => [{ text: array.map(item => `${item.text}`).join(' ') }],
        ingredientsList: array => [{ text: array.map(item => `${item.text}`).join(' ') }],
      };

      Object.entries(mappingObject).forEach(([key, fct]) => {
        if (row[key] && row[key].length > 0) {
          const result = fct(row[key]);
          if (Array.isArray(result)) {
            if (result[0] === Object(result[0])) {
              row[key] = result;
            } else {
              row[key] = [{ text: result[0] }];
            }
          } else {
            row[key] = [{ text: result }];
          }
        }
      });
      if (row.variants) {
        const asins = row.asin.concat(row.variants).map(elm => elm.text);
        row.variants = [...new Set(asins)].map(elm => ({ text: elm }));
      } else {
        row.variants = row.asin;
      }
      row.variantCount = [{ text: row.variants.length }];
      if (row.variantId) {
        row.variantId = [{ text: row.variantId[0].text.replace('parentAsin":"', '') }];
      }
      // if (row.salesRankCategory) {
      //   row.salesRankCategory = row.salesRankCategory.map(item => {
      //     const unWantedTxt = 'See Top 100 in ';
      //     if (item.text.includes('#')) {
      //       const regex = /#[0-9,]{1,} in (.+) \(/s;
      //       const rawCat = item.text.match(regex);
      //       return { text: rawCat ? rawCat[1].replace(unWantedTxt, '') : '' };
      //     }
      //     return { text: item.text.replace(unWantedTxt, '') };
      //   });
      // }
      // if (row.salesRank) {
      //   row.salesRank = row.salesRank.map(item => {
      //     if (item.text.includes('#')) {
      //       const regex = /([0-9,]{1,})/s;
      //       const rawCat = item.text.match(regex);
      //       return { text: rawCat ? castToInt(rawCat[0].split(/[,.\s]/).join('')) : 0 };
      //     }
      //     return { text: 0 };
      //   });
      // }
      if (row.manufacturerDescription && row.manufacturerDescription[0]) {
        const regexIgnoreText = /(Read more)/g;
        const text = row.manufacturerDescription[0].text.replace(/<(style|script|noscript)\b[^<]*(?:(?!<\/(style|script|noscript)>)<[^<]*)*<\/(style|script|noscript)>/g, '').replace(/(<([^>]+)>)/ig, '').replace(regexIgnoreText, '').trim();
        row.manufacturerDescription = [{ text }];
      }
      if (row.heroQuickPromoUrl && row.heroQuickPromoUrl[0]) {
        if (row.heroQuickPromoUrl[0].text.includes('http')) {
          row.heroQuickPromoUrl = [{ text: row.heroQuickPromoUrl[0].text }];
        } else {
          row.heroQuickPromoUrl = [{ text: `https://${hostName}/${row.heroQuickPromoUrl[0].text}` }];
        }
      }
      if (row.description || row.extraDescription) {
        const bonusDesc = row.extraDescription ? row.extraDescription.map(item => item.text.replace(/<li>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim()).join(' ').split(/From the Manufacturer|Brand Story/)[0] : '';
        if (row.description) {
          const text = row.description.map(item => item.text.replace(/<li>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim()).join(' ');
          // const formattedText = '|| ' + text.join(' || ').trim().replace(/\|\| \|/g, '|');
          // row.description = [{ text: formattedText + bonusDesc }];
          row.description = [{ text: [text, bonusDesc].join(' ').trim() }];
        } else {
          row.description = [{ text: bonusDesc }];
        }
      }
      if (row.amazonChoice && row.amazonChoice[0]) {
        if (row.amazonChoice[0].text.includes('Amazon')) {
          row.amazonChoice = [{ text: 'Yes' }];
        } else {
          delete row.amazonChoice;
        }
      }
      if (row.specifications) {
        const text = [];
        row.specifications.forEach(item => {
          text.push(`${item.text.replace(/\n \n/g, ':')}`);
        });
        row.specifications = [{ text: text }];
      }
      if (row.productOtherInformation) {
        const text = [];
        row.productOtherInformation.forEach(item => { text.push(item.text); });
        if (text.length > 0) {
          row.productOtherInformation = [{ text: text.join(' | ').trim().replace(/\| \|/g, '|') }];
        }
      }
      if (row.additionalDescBulletInfo) {
        const text = [''];
        row.additionalDescBulletInfo.forEach(item => {
          if (item.text.length > 0) { text.push(item.text); }
        });
        if (text.length > 0) {
          row.additionalDescBulletInfo = [{ text: text.join(' || ').trim().replace(/\|\| \|/g, '|') }];
        }
      }
      if (row.otherSellersPrime) {
        row.otherSellersPrime.forEach(item => {
          if (item.text.match(/details/i)) {
            item.text = 'YES';
          } else {
            item.text = 'NO';
          }
        });
      }
      // if (row.availabilityText && row.availabilityText[0]) {
      //   row.availabilityText = [
      //     {
      //       text: /[Ii]n [Ss]tock/gm.test(row.availabilityText[0].text) ? 'In stock' : row.availabilityText[0].text,
      //     },
      //   ];
      // }
      // if (row.unavailableMsg) {
      //   row.availabilityText = [{ text: 'Out of stock' }];
      // }

      if (row.otherSellersShipping2) {
        row.otherSellersShipping2 = row.otherSellersShipping2.map(item => {
          if (item.text.includes('+ $')) {
            const regex = /\$([0-9.]{3,})/s;
            const mtch = item.text.match(regex);
            return { text: mtch && mtch[1] ? item.text.match(regex)[1] : '0.00' };
          }
          return { text: '0.00' };
        });
      }
      if (row.primeFlag) {
        row.primeFlag = [{ text: 'Yes - Shipped and Sold' }];
      }
      if (row.ingredientsList) {
        row.ingredientsList = [{ text: row.ingredientsList.map(item => `${item.text}`).join(' ') }];
      }
      if (row.lowestPriceIn30Days) {
        row.lowestPriceIn30Days = [{ text: 'True' }];
      } else {
        row.lowestPriceIn30Days = [{ text: 'False' }];
      }
      if (!row.brandText && row.backupBrand) {
        row.brandText = [{ text: row.backupBrand[0].text }];
      }
      // if (!row.shippingWeight && row.dimensions) {
      //   const dimText = row.dimensions[0].text;
      //   if (dimText.includes(';')) {
      //     row.shippingWeight = [{ text: dimText.split(';')[1].trim() }];
      //   }
      // }
      // if (row.featureNames && row.featureStars) {
      //   featArr = [];
      //   for (let i = 0; i < row.featureNames.length; i++) {
      //     featArr.push(`${row.featureNames[i].text}:${row.featureStars[i].text}`);
      //   }
      //   row.starsByFeature = [{ text: featArr }];
      // }
      if (row.lbb && row.price) {
        if (row.lbb[0].text === 'YES') {
          row.lbbPrice = row.price;
        }
      }

      if (row.variantInformation) {
        const json = JSON.parse(row.variantInformation[0].text.trim());
        const text = Object.entries(json).map(prop => prop.map(elm => elm.replace('_name', '')).join(':')).join(' | ');
        row.variantInformation = [{ text }];
        if (!row.color || row.color[0].text.length === 0) {
          if (json.color_name) {
            row.color = [{ text: json.color_name }];
          }
        }
        if (!row.quantity || row.quantity[0].text.length) {
          if (json.size_name) {
            row.quantity = [{ text: json.size_name }];
          }
        }
      }

      if (!(row.quantity && row.quantity[0] && row.quantity[0].text) && (row.nameExtended && row.nameExtended[0] && row.nameExtended[0].text)) {
        const quantityText = row.nameExtended[0].text;
        const quantityRe = /(?:\s?([\d.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][.]?\s?[oO][zZ][.]?|FO|[mM][lL]|[oO][zZ][.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[s,S]ingle-serve K-Cup|[wW]ipe[s]?).?)(?:\s?([\d.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][.]?\s?[oO][zZ][.]?|FO|[mM][lL]|[oO][zZ][.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[s,S]ingle-serve K-Cup|[wW]ipe[s]?).?\s)*/;
        const packQuantityRe = /([(]Pack of \d*[)])/;
        const quantity = quantityRe.test(quantityText) ? quantityRe.exec(quantityText) : '';
        const packText = packQuantityRe.test(quantityText) ? packQuantityRe.exec(quantityText) : '';
        if (quantity && quantity[0]) {
          row.quantity = [{ text: quantity[0].trim() }];
        }

        if (quantity == null || !row.quantity) {
          row.quantity = [{ text: '' }];
        }

        if (packText.length && packText[0]) {
          row.quantity[0].text += row.quantity[0].text.length ? ' ' + packText[0] : packText[0];
        }
      }
      if (row.legalDisclaimer) {
        const text = row.legalDisclaimer.map(elm => elm.text).join(' ');
        row.legalDisclaimer = [{ text }];
      }
      if (row.directions) {
        const text = row.directions.map(elm => elm.text).join(' ');
        row.directions = [{ text }];
      }
      if (row.warnings) {
        const text = row.warnings.map(elm => elm.text).join(' ');
        row.warnings = [{ text }];
      }
      if (row.variantAsins) {
        const text = row.variantAsins.map(elm => elm.text).join(' | ');
        row.variantAsins = [{ text }];
      }

      const zoomText = row.imageZoomFeaturePresent ? 'Yes' : 'No';
      row.imageZoomFeaturePresent = [{ text: zoomText }];

      const subscriptionPresent = row.subscriptionPrice ? 'YES' : 'NO';
      row.subscribeAndSave = [{ text: subscriptionPresent }];
      row.variantId = row.asin;
      row.sku = row.asin;
      if (row.shippingWeight) {
        row.grossWeight = row.shippingWeight;
      }
      if (!row.packSize && row.packSizeFallback) {
        row.packSize = row.packSizeFallback;
      }
      if (!row.packSize && row.quantity) {
        const packSize = row.quantity[0].text.match(/Pack\s+of\s+(\d+)/i);
        if (packSize) {
          row.packSize = [{ text: packSize[1] }];
        }
      }
      if (row.manufacturerVideos) {
        if (!row.videos || row.videos[0].text === '') {
          row.videos = row.manufacturerVideos;
        } else {
          row.videos = [...row.videos, row.manufacturerVideos];
        }
        delete row.manufacturerVideos;
      }
      if (row.fastTrack) {
        const text = row.fastTrack[0].text.replace(/details/gi, '').trim();
        row.fastTrack[0].text = text;
      }
      Object.keys(row).forEach(header => {
        row[header].forEach(el => {
          el.text = clean(el.text);
        });
      });
    }
  }
  return data;
};

module.exports = { transform };