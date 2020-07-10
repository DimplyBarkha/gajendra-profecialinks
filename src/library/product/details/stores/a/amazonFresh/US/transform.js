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
        if (row.asin) {
          row.asin = [{ text: row.asin[0].text.match(/([A-Za-z0-9]{10,})/g)[0] }];
        }
        if (row.warnings) {
          row.warnings = [{ text: row.warnings[0].text.replace(/Safety Information/g, '').trim() }];
        }
        if (row.weightGross) {
          row.weightGross = [{ text: row.weightGross[0].text.trim() }];
        }
        if (row.shippingWeight) {
          row.shippingWeight = [{ text: row.shippingWeight[0].text.replace(/\s\(/g, '').trim() }];
        }
        if (row.grossWeight) {
          row.grossWeight = [{ text: row.grossgWeight[0].text.replace(/\s\(/g, '').trim() }];
        }
        if (row.largeImageCount) {
          const count = row.largeImageCount[0].text.toString().split("SL1500") ? (row.largeImageCount[0].text.toString().split("SL1500").length-1) : null;
          if(!!count){
            row.largeImageCount = [{ text: count }];
          }else{
            row.largeImageCount = [{ text: '0' }];
          }
        }
        if (row.alternateImages) {
          if(row.alternateImages.length > 0){
            let images = []
            row.alternateImages.forEach(image => {
              images.push(image.text)
            })
            row.alternateImages = [{ text: images.join(' | ').trim().replace(/\| \|/g, '|') }];
          }else{
            row.alternateImages = [{ text: '' }];
          }
        }
        if (row.videos) {
          let regex = /\"url\":\"([^"]+)/g
          const rawArray = row.videos[0].text.toString().match(regex)
          const videos = [];
          if(rawArray){
            rawArray.forEach(item => {
              let regex2 = /(https.+mp4)/s
              videos.push(item.match(regex2)[0])
            })
            row.videos = [{ text: videos.join(' | ').trim().replace(/\| \|/g, '|') }];
          }else{
            row.videos = [{ text: '' }];
          }
        }
        if (row.videoLength) {
          let regex1 = /\"durationTimestamp\":\"([^"]+)/g
          const rawArray = row.videoLength[0].text.toString().match(regex1)
          const videos = [];
          if(rawArray){
            rawArray.forEach(item => {
              let regex2 = /([0-9\:]{3,})/s
              videos.push(item.match(regex2)[0])
            })
            row.videoLength = [{ text: videos.join(' | ').trim().replace(/\| \|/g, '|') }];
          }else{
            row.videoLength = [{ text: '' }];
          }
        }
        if (row.brandLink) {
          if(!row.brandLink[0].text.includes('www.amazon.com')){
            row.brandLink = [{ text: `https://www.amazon.com${row.brandLink[0].text}` }];
          }else{
            row.brandLink = [{ text: row.brandLink[0].text }];
          }
        }
        if (row.brand) {
          const regexBrand = /([B|b]rand:)|([B|b]y)|([B|b]rand)|([V|v]isit the)/gm;
          if (regexBrand.test(row.brand[0].text)) {
            const brandName = (row.brandLink[0].text).replace(regexBrand, '');
            row.brand = [{ text: brandName }];
          }
        }
        if (row.name && row.name[0]) {
          if(row.name[0].text.match(/(Amazon.com\s*:)/)){
            row.name = [{ text: row.name[0].text.replace(/(Amazon.com\s*:)/, '') }];
          }
        }
        if (!(row.quantity && row.quantity[0] && row.quantity[0].text) && (row.nameExtended && row.nameExtended[0] && row.nameExtended[0].text)) {
          const quantityText = row.nameExtended[0].text;
          const quantityRe = /(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[s,S]ingle-serve K-Cup|[wW]ipe[s]?).?)(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[s,S]ingle-serve K-Cup|[wW]ipe[s]?).?\s)*/;
          const packQuantityRe = /([(]Pack of \d*[)])/;
          const quantity = quantityRe.test(quantityText) ? quantityRe.exec(quantityText) : '';
          const packText = packQuantityRe.test(quantityText) ? packQuantityRe.exec(quantityText) : '';
          if (quantity && quantity[0]) {
            row.quantity = [{ text: quantity[0].trim() }];
          }

          if (quantity == null) {
            row.quantity = [{ text: '' }];
          }

          if (packText.length && packText[0]) {
            row.quantity[0].text += row.quantity[0].text.length ? ' ' + packText[0] : packText[0];
          }
        }
        if (row.variantAsins) {
          let asins = [];
          row.variantAsins.forEach(item => {
            if(item.text.match(/([A-Za-z0-9]{8,})/g)){
              asins.push(item.text.match(/([A-Za-z0-9]{8,})/g)[0]);
            }
          });
          // @ts-ignore
          const dedupeAsins = [...new Set(asins)];
          row.variantAsins = [
            {
              text: dedupeAsins.join(' | ').trim().replace(/\| \|/g, '|')
            }
          ];
        }
        if (row.variantCount) {
          let asins = [];
          row.variantCount.forEach(item => {
            if(item.text){
              asins.push(item.text);
            }
          });
          // @ts-ignore
          const dedupeAsins = [...new Set(asins)];
          row.variantCount = [
            {
              text: dedupeAsins.length
            }
          ];
        }
        if (row.salesRankCategory) {
          let rankCat = []
          row.salesRankCategory.forEach(item => {
            if(item.text.includes('#')){
              let regex = /\#[0-9,]{1,} in (.+) \(/s
              let rawCat = item.text.match(regex)
              rankCat.push(
                {
                  text: rawCat[1]
                }
              );
            }else{
              rankCat.push(
                {
                  text: item.text
                }
              );
            }
          });
          row.salesRankCategory = rankCat
        }
        if (row.salesRank) {
          let rank = []
          row.salesRank.forEach(item => {
            if(item.text.includes('#')){
              let regex = /([0-9,]{1,})/s
              let rawCat = item.text.match(regex)
              if(!!rawCat){
                rank.push(
                  {
                    text: rawCat[0]
                  }
                );
              }
            }else{
              rank.push(
                {
                  text: ''
                }
              );
            }
          });
          row.salesRank = rank
        }
        if (row.manufacturerDescription) {
          let description = [];
          row.manufacturerDescription.forEach(item => {
            const regexIgnoreText = /^(Read more)/;
            item.text = item.text.replace(regexIgnoreText, '');
            description.push(item.text);
          });
          row.manufacturerDescription = [
            {
              text: description.join(' ').trim()
            }
          ];
        }
        if (row.heroQuickPromoUrl) {
          if(row.heroQuickPromoUrl[0].text.includes('http')){
            row.heroQuickPromoUrl = [{ text: row.heroQuickPromoUrl[0].text}]
          }else{
            row.heroQuickPromoUrl = [{ text: 'https://www.amazon.com/' + row.heroQuickPromoUrl[0].text}]
          }
        }
        if (row.description) {
          let text = ['']
          row.description.forEach(item => {
            text.push(item.text);
          })
          row.description = [{text: text.join(' || ').trim().replace(/\|\| \|/g, '|')}]
        }
        if (row.amazonChoice) {
          if (row.amazonChoice[0].text.includes('Amazon')) {
            row.amazonChoice = [
              {
                text: 'Yes',
              }
            ];
          } else {
            row.amazonChoice = [
              {
                text: 'No',
              }
            ];
          }
        }
        if (row.specifications) {
          let text = [];
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
          let text = []
          row.productOtherInformation.forEach(item => {
            text.push(item.text)
          })
          if(text.length>0){
            row.productOtherInformation = [
              {
                text: text.join(' | ').trim().replace(/\| \|/g, '|')
              }
            ]
          }
        }
        if (row.additionalDescBulletInfo) {
          let text = ['']
          row.additionalDescBulletInfo.forEach(item => {
            if(item.text.length > 0){text.push(item.text)}
          })
          if(text.length>0){
            row.additionalDescBulletInfo = [
              {
                text: text.join(' || ').trim().replace(/\|\| \|/g, '|')
              }
            ]
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
        if (row.availabilityText) {
          row.availabilityText = [
            {
              text: row.availabilityText[0].text.replace(/\./g,'').trim()
            }
          ]
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
          let text = [];
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
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
