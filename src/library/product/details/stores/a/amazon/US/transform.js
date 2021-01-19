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
            row.alternateImages = [{ text: images.join(' | ') }];
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
            row.videos = [{ text: videos.join(' | ') }];
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
            row.videoLength = [{ text: videos.join(' | ') }];
          }else{
            row.videoLength = [{ text: '0' }];
          }
        }
        if (row.brandLink) {
          if(!row.brandLink[0].text.includes('www.amazon.com')){
            row.brandLink = [{ text: `https://www.amazon.com${row.brandLink[0].text}` }];
          }else{
            row.brandLink = [{ text: row.brandLink[0].text }];
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
              text: dedupeAsins.join(' | ')
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
            description.push(item.text);
          });
          row.manufacturerDescription = [
            {
              text: description.join(' ')
            }
          ];
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
              text: text.join(' || '),
            },
          ];
        }
        if (row.otherSellersPrime) {
          row.otherSellersPrime.forEach(item => {
            if (item.text.includes('amazon') || item.text.includes('Amazon') || item.text.includes('Prime') || item.text.includes('prime')) {
              item.text = 'YES';
            } else {
              item.text = 'NO';
            }
          });
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
              text: text.join(' || '),
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
