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
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '');

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
          return array.length === 0 ? 0 : array.length - 1; // why minus 1???
        },
        alternateImages: array => joinArray(array.map(item => item.text)),
        videos: item => doubleRegexSearch(/"url":"([^"]+)/g, /(https.+mp4)/s, item),
        videoLength: item => doubleRegexSearch(/"durationTimestamp":"([^"]+)/g, /([0-9:]{3,})/s, item),
        brandLink: item => {
          if (!sg(item).includes(hostName)) return `https://${hostName}${sg(item)}`;
          return sg(item);
        },
        brandText: item => regexTestNReplace(/([B|b]rand:)|([B|b]y)|([B|b]rand)|([V|v]isit the)/gm, sg(item)),
        name: item => regexTestNReplace(new RegExp(String.raw`(${websiteName.replace(/\./g, '\\.')}\s*:)`), sg(item)),
        pricePerUnit: item => regexTestNReplaceArray(/[{()}]/g, item, { extraRegex: /[/].*$/g }),
        pricePerUnitUom: item => regexTestNReplaceArray(/[{()}]/g, item, { matchRegex: /([^/]+$)/g }),
        secondaryImageTotal: item => castToInt(sg(item)),
        ratingCount: item => castToInt(sg(item)),
        descriptionBullets: item => castToInt(sg(item)),
        shippingInfo: array => [{ text: array.map(item => `${item.text}`).join(' ') }],
        ingredientsList: array => [{ text: array.map(item => `${item.text}`).join(' ') }],
      };

      Object.entries(mappingObject).forEach(([key, fct]) => {
        if (row[key] && row[key].length > 0) {
          const result = fct(row[key]);
          if (Array.isArray(result)) row[key] = result;
          else row[key] = [{ text: result }];
        }
      });
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
      if (row.variantAsins) {
        let asins = [];
        if (row.variantAsins[0]) {
          if ((row.variantAsins[0].text.includes('asinVariationValues') && (row.variantAsins[0].text.includes('dimensionValuesData')))) {
            let jsonStr = row.variantAsins[0].text.split('"asinVariationValues" : ')[1].split('"dimensionValuesData" : ')[0];
            jsonStr = jsonStr.slice(0, -2);
            const jsonObj = JSON.parse(jsonStr);
            asins = Object.keys(jsonObj);
          } else {
            asins = [];
          }
        }
        const dedupeAsins = [...new Set(asins)];
        row.variantAsins = [{ text: joinArray(dedupeAsins) }];
      }
      if (row.variantCount && row.variantCount[0]) {
        if (typeof row.variantCount[0].text !== 'number') {
          if ((row.variants && row.variants[0])) {
            if ((row.variantCount[0].text.includes('asinVariationValues') && (row.variantCount[0].text.includes('dimensionValuesData')))) {
              let jsonStr = row.variantCount[0].text.split('"asinVariationValues" : ')[1].split('"dimensionValuesData" : ')[0];
              jsonStr = jsonStr.slice(0, -2);
              const jsonObj = JSON.parse(jsonStr);
              row.variantCount = [{ text: Object.keys(jsonObj).length }];
            } else {
              row.variantCount = [{ text: castToInt(sg(row.variantCount), 1) }];
            }
          } else {
            if (row.variantCount.length > 1) {
              row.variantCount = [{ text: [...new Set(row.variantCount)].length - 1 }];
            } else {
              row.variantCount = [{ text: castToInt(sg(row.variantCount), 1) }];
            }
          }
        } else {
          row.variantCount = [{ text: castToInt(sg(row.variantCount), 1) }];
        }
      }
      if (row.variants) {
        const asins = row.variants.reduce((acc, item) => {
          if (item.text) {
            acc.push(item.text);
            return acc;
          }
          return acc;
        }, []);
        row.variants = [{ text: [...new Set(asins)] }];
      }
      if (row.salesRankCategory) {
        row.salesRankCategory = row.salesRankCategory.map(item => {
          if (item.text.includes('#')) {
            const regex = /#[0-9,]{1,} in (.+) \(/s;
            const rawCat = item.text.match(regex);
            return { text: rawCat ? rawCat[1] : '' };
          }
          return { text: item.text };
        });
      }
      if (row.salesRank) {
        row.salesRank = row.salesRank.map(item => {
          if (item.text.includes('#')) {
            const regex = /([0-9,]{1,})/s;
            const rawCat = item.text.match(regex);
            return { text: rawCat ? castToInt(rawCat[0].split(/[,.\s]/).join('')) : 0 };
          }
          return { text: 0 };
        });
      }
      if (row.manufacturerDescription && row.manufacturerDescription[0]) {
        const description = [];
        row.manufacturerDescription.forEach(item => {
          const regexIgnoreText = /^(Read more)/;
          item.text = (item.text).toString().replace(regexIgnoreText, '');
          if (!regexIgnoreText.test(item.text)) {
            description.push(item.text);
          }
        });
        row.manufacturerDescription = [{ text: description.join(' ').trim() }];
      }
      if (row.heroQuickPromoUrl && row.heroQuickPromoUrl[0]) {
        if (row.heroQuickPromoUrl[0].text.includes('http')) {
          row.heroQuickPromoUrl = [{ text: row.heroQuickPromoUrl[0].text }];
        } else {
          row.heroQuickPromoUrl = [{ text: `https://${hostName}/${row.heroQuickPromoUrl[0].text}` }];
        }
      }
      if (row.description) {
        const text = row.description.map(item => item.text);
        row.description = [{ text: text.join(' || ').trim().replace(/\|\| \|/g, '|') }];
      }
      if (row.amazonChoice && row.amazonChoice[0]) {
        if (row.amazonChoice[0].text.includes('Amazon')) {
          row.amazonChoice = [{ text: 'Yes' }];
        } else {
          row.amazonChoice = [{ text: 'No' }];
        }
      }
      if (row.specifications) {
        const text = [];
        row.specifications.forEach(item => {
          text.push(`${item.text.replace(/\n \n/g, ':')}`);
        });
        row.specifications = [{ text: text.join(' || ').trim().replace(/\|\| \|/g, '|') }];
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
        row.otherSellersShipping2 = row.otherSellersShipping2.map(item => {
          if (item.text.includes('+ $')) {
            const regex = /\$([0-9.]{3,})/s;
            const mtch = item.text.match(regex);
            return { text: mtch && mtch[1] ? item.text.match(regex)[1] : '0.00' };
          }
          return { text: '0.00' };
        });
      }
      if (row.featureBullets) {
        const text = row.featureBullets.map(item => `${item.text}`);
        row.featureBullets = [{ text: text.join(' || ').trim().replace(/\|\| \|/g, '|') }];
      }
      if (row.primeFlag) {
        row.primeFlag = [{ text: 'Yes' }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
