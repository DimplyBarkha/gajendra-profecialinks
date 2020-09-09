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
        if (row.description) {
          row.description[0].text = row.description[0].text.replace(/(\n\s*){5,}/g, '').replace(/(\n\s*){4,}/g, '').replace(/(\n\s*){2,}/g, ' || ');
          row.description[0].text = cleanUp(row.description[0].text);
        }

        if (row.manufacturerDescription) {
          row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/(\n\s*){9,}/g, '').replace(/(\n\s*){8,}/g, '').replace(/(\n\s*){7,}/g, '').replace(/(\n\s*){6,}/g, '').replace(/(\n\s*){5,}/g, '').replace(/(\n\s*){4,}/g, '').replace(/(\n\s*){2,}/g, ' ');
          row.manufacturerDescription[0].text = cleanUp(row.manufacturerDescription[0].text);
        }

        if(row.manufacturerDescription1) {
          row.manufacturerDescription1[0].text = cleanUp(row.manufacturerDescription1[0].text);
          row.manufacturerDescription[0].text += " " + row.manufacturerDescription1[0].text;
          delete row.manufacturerDescription1;
        }

        if (row.specifications) {
            row.specifications[0].text = row.specifications[0].text.replace(/(\n\s*){3,}/g, ' || ').replace(/(\n\s*){2,}/g, ':');
            row.specifications[0].text = cleanUp(row.specifications[0].text);
        }

        if (row.name && row.brandText) {
            row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
        }

        if(row.videos && row.videos1) {
          row.videos = [...row.videos, ...row.videos1];
          delete row.videos1;
        }

        if(row.manufacturerImages2) {
          row.manufacturerImages2 = row.manufacturerImages2.map((image) => {
            image.text = 'https:' + image.text.replace(/([^\s]+)\s.*/, '$1');
            return image;
          });

          row.manufacturerImages = [...row.manufacturerImages, ...row.manufacturerImages2];
          delete row.manufacturerImages2;
        }

        if(row.manufacturerImages) {
          if(row.manufacturerImages1) {
            row.manufacturerImages = [...row.manufacturerImages, ...row.manufacturerImages1];
            delete row.manufacturerImages1;
          }
        }

        if(!row.manufacturerImages) {
          delete row.manufacturerDescription;
        }
      }
    }
    return data;
  };
module.exports = { transform };