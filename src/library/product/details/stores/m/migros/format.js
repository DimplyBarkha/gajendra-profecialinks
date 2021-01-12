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
      debugger;

    if (row.shownImages) {

      row.shownImages.forEach(item => {
       item.text = item.text.replace("background-image:","  ").trim();
       item.text = item.text.replace("url","  ").trim();
       item.text = item.text.replace("(","  ").trim();
       item.text = item.text.replace(")","  ").trim();
       item.text = item.text.replace("\"", ' ').trim();
       item.text = item.text.replace(";", ' ').trim();
       item.text = item.text.replace("\"", ' ').trim();
       console.log("item.text",item.text);
      });
    }

    if (row.highQualityImages) {
      row.highQualityImages.forEach(item => {
       item.text = item.text.replace("background-image:","  ").trim();
       item.text = item.text.replace("url","  ").trim();
       item.text = item.text.replace("(","  ").trim();
       item.text = item.text.replace(")","  ").trim();
       item.text = item.text.replace("\"", ' ').trim();
       item.text = item.text.replace(";", ' ').trim();
       item.text = item.text.replace("\"", ' ').trim();
       console.log("item.text",item.text);
      });
    }

    // if (row.nutritionInfo) {
    //   row.nutritionInfo.forEach(item => {
    //     if(item.text.includes("Double Lait : 100g: ")){
    //       item.text = item.text.replace('Double Lait : 100g: ', ' ').trim();
    //     }
    //     if(item.text.includes("100")){
    //       item.text = item.text.replace('100g', ' ').trim();
    //     }
    //     console.log("item.text",item.text);
    //   });
    // }



    }
  }
  return cleanUp(data);
};

module.exports = { transform };
