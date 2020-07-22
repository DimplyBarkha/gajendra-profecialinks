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
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
            // if (item.text.match('Product Description')) {
            //   item.text = item.text.replace('Product Description', '');
            // }
            if (item.text.match('The information above is powered by')) {
              item.text = item.text.replace('The information above is powered by', '');
            }
          });
        }
        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }
        if (row.packSize && row.packSize[0] && row.packSize[0].text.length) {
          row.packSize[0].text = row.packSize[0].text.replace('x ', '');
        }
        if (row.imageZoomFeaturePresent && row.imageZoomFeaturePresent[0] && row.imageZoomFeaturePresent[0].text.length) {
          if (row.imageZoomFeaturePresent[0].text === 'true' || row.imageZoomFeaturePresent[0].text === '1') {
            row.imageZoomFeaturePresent[0].text = 'Yes';
          } else {
            row.imageZoomFeaturePresent[0].text = 'No';
          }
        }
        if (row.manufacturerImages) {
          const aplusImagesText = [];
          const aplusImages = [];
          row.manufacturerImages.forEach(item => {
            if (aplusImagesText.indexOf(item.text) === -1) {
              aplusImagesText.push(item.text);
              aplusImages.push(item);
            }
          });
          row.manufacturerImages = aplusImages;
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
