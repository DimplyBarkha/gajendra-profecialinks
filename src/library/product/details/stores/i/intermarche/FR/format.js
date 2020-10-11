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
    for (let row of group) {

      if (row.nameExtended1 && row.nameExtended1[0].text) {
        row.nameExtended = [{text: row.nameExtended1[0].text}];
      }
      if (row.nameExtended && row.nameExtended2 && row.nameExtended2[0].text) {
        row.nameExtended[0].text = `${row.nameExtended[0].text} ${row.nameExtended1[0].text}`;
      }
      if (row.brandText && row.brandText[0].text) {
        row.nameExtended[0].text = `${row.brandText[0].text} ${row.nameExtended[0].text}`;
      }

      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
      }

      if (row.videos) {
        let videoArray = [];
        row.videos.forEach(video => {
          if (!videoArray.includes(video.text)) {
            videoArray.push(video.text);
          }
        });
        row.videos = [{ text: "" }]
        let videoStr = videoArray.join(" | ");
        row.videos[0].text = videoStr;
      }

      if (row.manufacturerImages) {
        let manufImageArray = [];
        row.manufacturerImages.forEach(manufImage => {
          if (!manufImageArray.includes(manufImage.text)) {
            manufImageArray.push(manufImage.text);
          }
        });
        row.manufacturerImages = [{ text: "" }]
        let manufImageStr = manufImageArray.join(" | ");
        row.manufacturerImages[0].text = manufImageStr;
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };