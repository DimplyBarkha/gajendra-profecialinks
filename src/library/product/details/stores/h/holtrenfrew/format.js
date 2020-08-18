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
  
    const prefixImageWithDomain = (image) => {
        const domainPrefix = "https:";
        const { text } = image;
        return { ...image, text: domainPrefix + text };
    }

    for (const { group } of data) {
      for (const row of group) {
        // Added code as brand is not available directly on the webpage
        if (row.descriptionBullets) {
            const text = [];
            text.push({ text: row.descriptionBullets.length });
            row.descriptionBullets = text;
        }
        if(row.description) {
            const text = [];
            text.push({ text: row.description[0].text.split('\n').join(" || "), xpath: row.description[0].xpath});
            row.description = text;
        }
        if(row.alternateImages) {
          row.alternateImages.splice(0, 1);
          row.alternateImages = row.alternateImages.map(prefixImageWithDomain);
        }
        if(row.image) {
          row.image = row.image.map(prefixImageWithDomain);
        }
        
        row.imageZoomFeaturePresent[0].text = row.imageZoomFeaturePresent ? "Yes" : "No";
      }
    }
    return data;
  };
  module.exports = { transform };