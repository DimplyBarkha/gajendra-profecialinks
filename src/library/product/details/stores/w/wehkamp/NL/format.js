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
      if (row.nameExtended) {
        if (row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('?w=200', '');
        });
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
            row.aggregateRating = [{ text: scriptJSON.aggregateRating.ratingValue }];
          }
          if (scriptJSON.aggregateRating.reviewCount) {
            row.ratingCount = [{ text: scriptJSON.aggregateRating.reviewCount }];
          }
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
      // if (row.variantCount) {
      //   row.variantCount = [{ text: row.variantCount.length }];
      // }
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
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
