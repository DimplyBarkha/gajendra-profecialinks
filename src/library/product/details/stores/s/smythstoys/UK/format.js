
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.alternateImages) {
        let alternateImagesArray = [];
        row.alternateImages.forEach(item => {
          alternateImagesArray.push(item.text);
        });
        row.alternateImages = [{ 'text': alternateImagesArray.join(' | '), 'xpath': row.alternateImages[0].xpath }];
      }

      if (row.shownImages) {
        let shownImagesArray = [];
        row.shownImages.forEach(item => {
          shownImagesArray.push(item.text);
        });
        row.shownImages = [{ 'text':  shownImagesArray.join(' | '), 'xpath': row.shownImages[0].xpath }];
      }


      if (row.videos) {
        let videosArray = [];
        row.videos.forEach(item => {
          videosArray.push(item.text);
        });
        row.videos = [{ 'text': videosArray.join(' | '), 'xpath': row.videos[0].xpath }];
      }

      if (row.sku) {
        row.sku.forEach(item => {
          console.log('HEY DATA',item);
          item.text = item.text.replace('Ref:', '').trim();
        })
      }

      if (row.variantId) {
        row.variantId.forEach(item => {
          console.log('HEY DATA',item);
          item.text = item.text.replace('Ref:', '').trim();
        })
      }



    }
  }
  // Clean up data
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
