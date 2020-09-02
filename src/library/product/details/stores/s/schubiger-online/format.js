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

      if (row.specifications) {
        row.specifications.forEach((specificationsItem) => {
          specificationsItem.text = specificationsItem.text.replace(/(\n\s*){5,}/g, ' || ').replace(/(\n\s*){3,}/g, ' : ');
        });
      }

      if (row.alternateImages) {
        row.alternateImages.forEach((alternateImagesItem) => {
          alternateImagesItem.text = alternateImagesItem.text.replace(/\/\/(.*)XX(.*)/gm, '$1$2');
        });
      }

      if (row.description) {
        row.description.forEach((descriptionItem) => {
          descriptionItem.text = cleanUp(descriptionItem.text);
        });
      }

      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach((technicalInformationPdfPresentItem) => {
          if (technicalInformationPdfPresentItem.text.toLowerCase().includes('technische daten')) {
            technicalInformationPdfPresentItem.text = 'Yes';
          }
        });
      } else {
        row.technicalInformationPdfPresent = [{ text: 'No' }];
      }
    }
  }
  return data;
};
module.exports = { transform };
