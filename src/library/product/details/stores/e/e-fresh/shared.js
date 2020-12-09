/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log("INSIDE OF CLEANUP");
    dataStr = dataStr
      .replace(/(?:\\r\\n|\\r|\\n)/g, " ")
      .replace(/&amp;nbsp;/g, " ")
      .replace(/&amp;#160/g, " ")
      .replace(/\\u00A0/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, " ")
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, "");

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.alternateImages) {
          const altImages = [];
          let dupUrl = "";
          let urls = [];
          row.alternateImages.forEach((item) => {
            // console.log('item:: ', item.text);
            urls = row.alternateImages.filter((it) => item.text === it.text);
            // console.log("urls:: ", urls);
            if (urls && urls.length === 1) {
              altImages.push(item.text);
            } else {
              if (dupUrl !== item.text && altImages.indexOf(item.text) == -1) {
                dupUrl = item.text;
                // console.log('dupUrl:: ', dupUrl);
                altImages.push(item.text);
              }
            }
          });
          // console.log('altImages:: ', altImages);
          row.alternateImages = altImages;
          const images = [];
          altImages.forEach((item) => {
            // console.log("alternateImages: ", item);
            const text1 = item
              .replace("thumbs/", "")
              .replace("-95x95_crop_thumb", "");
            const img = { text: text1 };
            images.push(img);
          });
          // console.log('images ==', images);
          row.alternateImages = images;
          if (row.secondaryImageTotal) {
            row.secondaryImageTotal[0].text = images.length;
          }
        }

        row = cleanUp(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};
module.exports = { transform };
