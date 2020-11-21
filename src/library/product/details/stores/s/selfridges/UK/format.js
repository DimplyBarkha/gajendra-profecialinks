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
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace('Weight:', '');
          item.text.trim();
        });
      }
      if (row.materials) {
        row.materials.forEach(item => {
          item.text = item.text.replace('Material:', '');
          item.text.trim();
        });
      }
      // if (row.additionalDescBulletInfo) {
      //   var arrBullet = [];
      //   row.additionalDescBulletInfo.forEach(item => {
      //     arrBullet.push(item.text);
      //   });
      //   row.additionalDescBulletInfo = [{ text: '|| ' + arrBullet.join(' || ') }];
      //   row.descriptionBullets = [{ text: arrBullet.length }];
      // }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications[0].text = row.specifications[0].text.replace(/Specifications/, '');
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\s*:\s*/g, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.selfridges.com' + item.text;
        });
      }
      if (row.nameExtended) {
        if (row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };