

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
      console.log("hi format")
      if (row.description) {

        let desc = '';
        row.description.forEach(item => {
          desc += `${item.text}`;
        });
        row.description = [
          {
            text: desc
          },
        ];
      }

      if (row.highQualityImages) {
        let uniqueImages = [... new Set( row.highQualityImages.map( images => images.text))].map(image => { return ({text:image})});
        row.highQualityImages = uniqueImages;
      }

      if (row.shownImages) {
        let uniqueImages = [... new Set( row.highQualityImages.map( images => images.text))].map(image => { return ({text:image})});
        row.shownImages =Array.from( uniqueImages );
      }

      if (row.brandText) {
        row.brandText.forEach(item => {
          if(item.text === 'Star Wars'){
            item.text = 'LEGO ' + item.text;
          }
          else{
            item.text = item.text;
          }
        });
      }
      if (row.shortDescription) {

        let shortDesc = '';
        row.shortDescription.forEach(item => {
          shortDesc += `${item.text}`;
        });
        row.shortDescription = [
          {
            text: shortDesc
          },
        ];
      }



    }
  }
  return cleanUp(data);
};

module.exports = { transform };
