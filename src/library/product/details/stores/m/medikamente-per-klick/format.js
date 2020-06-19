
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        row.image.forEach(image => {
          image.text = `https://www.medikamente-per-klick.de${image.text}`;
        });
      }
      if (row.alternateImages) {
        row.secondaryImageTotal = [{
          text: row.alternateImages.length,
        }];
        row.alternateImages.forEach(alternateImage => {
          alternateImage.text = `https://www.medikamente-per-klick.de${alternateImage.text}`.replace('/klein/', '/mittel/').replace('_k.', '_m.');
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
