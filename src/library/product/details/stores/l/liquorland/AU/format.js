
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
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.liquorland.com.au' + item.text;
        });
      }
      if (row.image) {
        delete row.image2;
      }
      else if (row.image2) {
        row.image = [{ text: row.image2[0].text }];
        delete row.image2;
      }
      if (row.alternateImages) {
        row.image = [{ text: row.alternateImages[0].text }];
        row.alternateImages.splice(0, 1);
      }
      if (row.ratingCount) {
        var ratingObj = JSON.parse(row.ratingCount[0].text);
        if (ratingObj.aggregateRating) {
          if (ratingObj.aggregateRating.ratingCount) {
            row.ratingCount = [{ text: ratingObj.aggregateRating.ratingCount }];
          }
          if (ratingObj.aggregateRating.ratingValue) {
            row.aggregateRating = [{ text: ratingObj.aggregateRating.ratingValue }];
          }
        }
      }
      if (row.specificationsKey) {
        var arrSpec = [];
        if (row.specificationsValue) {
          for (var i = 0; i < row.specificationsValue.length; i++) {
            arrSpec.push(row.specificationsKey[i].text + ' : ' + row.specificationsValue[i].text);
          }
          delete row.specificationsValue;
          delete row.specificationsKey;
        }
        if (arrSpec.length) {
          row.specifications = [{ text: arrSpec.join(' || ') }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };