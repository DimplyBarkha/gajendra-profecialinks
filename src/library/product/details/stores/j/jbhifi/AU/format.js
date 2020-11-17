
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
      if (row.additionalDescBulletInfo) {
        var bulletInfo = [];
        row.additionalDescBulletInfo.forEach(item => {
          bulletInfo.push(item.text);
        });
        if (bulletInfo.length) {
          row.additionalDescBulletInfo = [{ text: '|| ' + bulletInfo.join(' || ') }];
          row.descriptionBullets = [{ text: bulletInfo.length }];
        }
      }
      if (row.price) {
        if (row.price1) {
          row.price = [{ text: row.price[0].text + row.price1[0].text }];
          delete row.price1;
        }
        if (row.price2) {
          row.price = [{ text: row.price[0].text + row.price2[0].text }];
          delete row.price2;
        }
        if (row.price3) {
          row.price = [{ text: row.price[0].text + row.price3[0].text }];
          delete row.price3;
        }
      }
      if (row.category) {
        row.category.splice(0, 1);
        row.category.splice(row.category.length - 1, 1);
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.videos1) {
        row.videos = [];
        row.videos1.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
          row.videos.push({ text: item.text });
        });
        delete row.videos1;
      }
      if (row.videos2) {
        if (!(row.videos)) {
          row.videos = [];
        }
        row.videos2.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
          row.videos.push({ text: item.text });
        });
        delete row.videos2;
      }
      // if (row.videos3) {
      //   if (!(row.videos)) {
      //     row.videos = [];
      //   }
      //   row.videos3.forEach(item => {
      //     if (item.text.indexOf('http') < 0) {
      //       item.text = 'https:' + item.text;
      //     }
      //     row.videos.push({ text: item.text });
      //   });
      //   delete row.videos3;
      // }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
            item.text = item.text.replace('_100x100', '');
            item.text = item.text.replace('_large', '');
            item.text = item.text.replace('_small', '');
          }
        });
      }
      if (row.description) {
        var arrDesc = [];
        row.description.forEach(item => {
          arrDesc.push(item.text);
        });
        row.description = [{ text: arrDesc.join(' ') }];
      }
      if (row.manufacturerDescription) {
        var arrMfr = [];
        row.manufacturerDescription.forEach(item => {
          arrMfr.push(item.text);
        });
        row.manufacturerDescription = [{ text: arrMfr.join(' ') }];
      }
      if (row.manufacturerImages) {
        var arrMfrImg = [];
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
            arrMfrImg.push(item.text);
          }
        });
        if (arrMfrImg.length) {
          row.manufacturerImages = [{ text: arrMfrImg.join(' | ') }];
        }
      }
      if (row.shippingDimensionsW) {
        var length = '';
        var width = row.shippingDimensionsW[0].text;
        var height = '';
        if (row.shippingDimensionsL) {
          length = row.shippingDimensionsL[0].text;
          delete row.shippingDimensionsL;
        }
        if (row.shippingDimensionsH) {
          height = row.shippingDimensionsH[0].text;
          delete row.shippingDimensionsH;
        }
        if (length && width && height) {
          row.shippingDimensions = [{ text: length + 'x' + width + 'x' + height }];
        }
        delete row.shippingDimensionsW;
      }
      if (row.specifications) {
        var arrSpec = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n/g, ' : ');
          arrSpec.push(item.text);
        });
        if (arrSpec.length) {
          row.specifications = [{ text: arrSpec.join(' || ') }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };