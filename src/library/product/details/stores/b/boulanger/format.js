/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
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
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(/,/gm, '.');
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.promotion) {
        row.promotion.forEach(item => {
          if (item.text && item.text.includes('0%')) {
            item.text = '';
          }
        });
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = item.text.replace(/(.*)Poids.*/gm, '$1');
          item.text = item.text.trim();
        });
      }
      if (row.videos) {
        row.videos.forEach(videoItem => {
          videoItem.text = videoItem.text.replace(/.*url.*?(https.*)".*/gm, '$1');
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
