
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
      if (row.variantInformation) {
        const info = [];
        row.variantInformation.forEach(item => {
          info.push(item.text.trim());
        });
        // row.variantCount = [{'text': info.length}];
        row.variantInformation = [{ text: info.join(' | '), xpath: row.variantInformation[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        const info = [];
        row.additionalDescBulletInfo.forEach(item => {
          info.push(item.text.trim());
        });
        row.descriptionBullets = [{ text: info.length }];
        row.additionalDescBulletInfo = [{ text: '|| ' + info.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          item.text = item.text.replace(/(\s*Overview:\s*\|\|\s*)+/g, '').trim();
        });
      }
      if (row.packSize) {
        row.packSize.forEach(item => {
          var matches = /.*Pack\s+Of\s+(\d+).*/isg.exec(item.text);
          if (matches) {
            item.text = matches[1];
          } else {
            delete row.packSize;
          }
        });
      }
      if (row.quantity) {
        row.quantity.forEach(item => {
          item.text = 1;
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          const data = JSON.parse(item.text);
          if (data.length > 0 && data[0].aggregateRating && data[0].aggregateRating.reviewCount) {
            item.text = data[0].aggregateRating.reviewCount;
          } else {
            delete row.ratingCount;
          }
        });
      }
      if (row.description) {
        const info = [];
        row.description.forEach(item => {
          var matches = /Description\s*:\s(.+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1];
          }
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());
        });
        row.description = [{ text: info.join(' | '), xpath: row.description[0].xpath }];
      }
      if (row.unInterruptedPDP) {
        const titles = Array.from(new Set(row.unInterruptedPDP.map(elm => elm.text.trim())));
        row.unInterruptedPDP = titles.map(text => ({ text }));
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
