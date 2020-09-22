/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.color) {
        row.color = [{ text: row.color.map(item => item.text).join() }]
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription = Array.from(new Set(row.manufacturerDescription.map(item => item.text)).values()).map(item => { return { text: item } });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages = Array.from(new Set(row.manufacturerImages.map(item => item.text)).values()).map(item => { return { text: item } });
      }
      if (row.productOtherInformation) {
        row.productOtherInformation.map(item => {
          item.text = item.text.replace(/\n /, " ").replace(/\n /gm, "");
        });
      }
      if (row.specifications) {
        row.specifications = [{ text: row.specifications.map(item => item.text.replace(/\n/, "").replace(/\n /gm, "")).join(" | ") }]
      }
      if (row.videos) {
        row.videos = Array.from(new Set(row.videos.map(item => item.text)).values()).map(item => { return { text: item } });
      }
    }
  }
  return data;
};

module.exports = { transform };