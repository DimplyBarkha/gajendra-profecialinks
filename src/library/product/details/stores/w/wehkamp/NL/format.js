/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {
      // if (row.nameExtended) {
      //   if (row.brandText) {
      //     row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
      //   }
      // }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('?w=200', '');
        });
        row.descriptionBullets = [{text:row.alternateImages.length}];
      }
      if (row.descriptionBullets) {
        var bulletArr = [];
        row.descriptionBullets.forEach(item => {
          bulletArr.push(item.text);
        });
        row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.ratingCount) {
        var scriptJSON = JSON.parse(row.ratingCount[0].text);
        if (scriptJSON.aggregateRating) {
          if (scriptJSON.aggregateRating.ratingValue) {
            var tempRating = scriptJSON.aggregateRating.ratingValue;
            if (tempRating) {
              tempRating = tempRating.toString().replace('.', ',');
              row.aggregateRating = [{ text: tempRating }];
            }
          }
          if (scriptJSON.aggregateRating.reviewCount) {
            row.ratingCount = [{ text: scriptJSON.aggregateRating.reviewCount }];
          }
        }
        else {
          delete row.ratingCount;
        }
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(',', '');
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(',', '');
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          if (!(item.text.includes('http'))) {
            item.text = 'http:' + item.text;
          }
        });
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.price.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullets.join(' || ') }];
      }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = (item.text * 5) / 10;
      //   });
      // }
      if (row.packSize) {
        let pack = [];
        row.packSize.forEach(item => {
          pack = item.text.split(' ');
          if(pack[0]){
            item.text = pack[0];
          }else{
            item.text = '';
          }
        });
      }

      if (row.brandText) {
        row.brandText.forEach(item => {
           let data1 = JSON.parse(item.text);
          if(data1.hasOwnProperty('brand')){
            if(data1.brand.hasOwnProperty('name')){
              item.text = data1.brand.name;
            }else{
              item.text = "";
            }
          }else{
            item.text = "";
          }
        });
      }

      if (row.variantId) {
        let varient = '';
        row.variantId.forEach(item => {
          varient = item.text.replace(/\D/g, "");
          if(varient !== ''){
            item.text = varient;
          }else{
            item.text = '';
          }
        });
      }

    }
  }
  return cleanUp(data);
};

module.exports = { transform };
