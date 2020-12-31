/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      var bulletsText = '';
      var bulletsCount = 0;
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo.length) {
        bulletsCount = row.additionalDescBulletInfo.length;
        row.additionalDescBulletInfo.forEach((ele) => {
          if (ele.text) {
            bulletsText += '||' + ele.text.trim();
          }
        });
        row.additionalDescBulletInfo = [
          {
            text: bulletsText,
          }];
      }
      if (row.descriptionBullets && bulletsCount) {
        row.descriptionBullets[0].text = bulletsCount;
      }
      if (row.specifications) {
        var specText = '';
        for (var j = 0; j < row.specifications.length; j = j + 2) {
          specText += row.specifications[j].text + ': ' + row.specifications[j + 1].text + ' || ';
        }
        row.specifications = [{
          text: (specText.slice(0, -3)).trim(),
        }];
      }
      if (row.category && row.category.length) {
        row.category = row.category.map((e) => {
          e.text = e.text.replace('Go to ', '');
          return e;
        });
      }
      if (row.alternateImages && row.alternateImages.length) {
        row.alternateImages = row.alternateImages.map((e) => {
          e.text = e.text.replace('recipeId=735', 'recipeId=728');
          return e;
        });
      }
      if (row.price && (!row.price[0].text.includes('$'))) {
        row.price[0].text = '$'.concat(row.price[0].text);
        if (row.price[0].text.includes('-')) {
          row.price[0].text = '';
        }
      }
      if (row.listPrice && (!row.listPrice[0].text.includes('$'))) {
        row.listPrice[0].text = '$'.concat(row.listPrice[0].text);
        if (row.price[0].text.includes('-')) {
          row.price[0].text = '';
        }
        if (row.price[0].text === row.listPrice[0].text) {
          delete row.listPrice;
        }
      }
      if (row.termsAndConditions) {
        row.termsAndConditions[0].text = row.termsAndConditions[0].text === 'No' ? 'No' : 'Yes';
      }
      if (row.quantity) {
        if (row.quantity[0].text.includes('fl oz')) {
          var size = row.quantity[0].text.split(',');
          for (var k = 0; k < size.length; k++) {
            if (size[k].includes('fl oz')) {
              row.quantity = [
                {
                  text: size[k].trim(),
                }];
            }
          }
        } else {
          delete row.quantity;
        }
      }
      if (row.pricePerUnitUom) {
        if (row.pricePerUnitUom[0].text.includes('-')) {
          row.pricePerUnitUom[0].text = '';
        }
      }
      if (row.pricePerUnit) {
        if (row.pricePerUnit[0].text.includes('-')) {
          row.pricePerUnit[0].text = '';
        }
      }
      if (row.videos) {
        row.videos.forEach(item => {
          if (item.text.includes('.hls.m3u8')) {
            item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
          }
        });
      }
      if (row.fastTrack) {
        var fastText = '';
        row.fastTrack.forEach((ele) => {
          if (ele.text) {
            fastText += ' ' + ele.text.trim();
          }
        });
        row.fastTrack[0].text = fastText;
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/s/, '').trim();
        });
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n \n/g, ' || ');
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
    }
  }
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

module.exports = { transform };
