/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (text) =>
    text
      .toString()
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
      if (row.image) {
        row.image.forEach((imageItem) => {
          imageItem.text = imageItem.text.replace(/\/\/(.*)XX(.*)/gm, '$1$2');
        });
      }

      if (row.alternateImages) {
        row.alternateImages.forEach((alternateImagesItem) => {
          alternateImagesItem.text = alternateImagesItem.text.replace(/\/\/(.*)XX(.*)/gm, '$1$2');
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
