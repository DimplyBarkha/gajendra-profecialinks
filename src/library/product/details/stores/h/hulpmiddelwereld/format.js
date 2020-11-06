
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
        const info = [];
        row.additionalDescBulletInfo.forEach(item => {
          info.push(item.text.trim());
        });
        row.descriptionBullets = [{ text: info.length }];
        row.additionalDescBulletInfo = [{ text: '|| ' + info.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.specifications) {
        var arrTemp = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n/g, ':');
          arrTemp.push(item.text);
        });
        row.specifications = [{ text: '||' + arrTemp.join('||') }];
      }
      if (row.alternateImages) {
        row.largeImageCount = [{ text: row.alternateImages.length }];
        row.alternateImages = row.alternateImages.slice(1);
      }
      if (row.brandText) {
        if (row.nameExtended) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          // "gtin13":"5050996038469\"
          var myRegexp = /\"gtin13\"\s*:\s*\"(.+?)\"/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            delete row.gtin;
          }
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
