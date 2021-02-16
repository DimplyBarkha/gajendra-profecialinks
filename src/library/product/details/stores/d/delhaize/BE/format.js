/**
 * @format
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.calciumPerServing) {
				row.calciumPerServing[0].text = row.calciumPerServing[0].text.replace(
					'mg',
					''
				);
			}
			if (row.brandText) {
				let text = row.brandText
					.map((element) => element.text.trim())
					.join(' - ');
				row.brandText = [{ text }];
			}
			if (row.caloriesPerServing) {
				let text = row.caloriesPerServing[0].text
					.replace(/'kj'/g, '')
					.replace('KCAL', '')
					.replace('kJ', '')
					.replace('KJ', '');
				row.caloriesPerServing = [{ text }];
			}
			if (row.totalFatPerServing) {
				let text = row.totalFatPerServing[0].text.replace(/g/g, '');
				row.totalFatPerServing = [{ text }];
			}
			if (row.saturatedFatPerServing) {
				let text = row.saturatedFatPerServing[0].text.replace('g', '');
				row.saturatedFatPerServing = [{ text }];
			}
			if (row.totalCarbPerServing) {
				let text = row.totalCarbPerServing[0].text.replace('g', '');
				row.totalCarbPerServing = [{ text }];
			}
			if (row.totalSugarsPerServing) {
				let text = row.totalSugarsPerServing[0].text.replace('g', '');
				row.totalSugarsPerServing = [{ text }];
			}
			if (row.proteinPerServing) {
				let text = row.proteinPerServing[0].text.replace('g', '');
				row.proteinPerServing = [{ text }];
			}
			if (row.servingSize) {
				let text = row.servingSize[0].text
					.replace(/(g|ml)/, '')
					.replace('MLT', '');
				row.servingSize = [{ text }];
			}
			if (row.sku) {
				row.sku[0].text = row.sku[0].text.trim();
			}
			if (row.imageAlt) {
				let text = row.imageAlt[0].text;
				row.imageAlt = [{ text }];
			}
			if (row.servingSizeUom) {
				let text = row.servingSizeUom[0].text;
				row.servingSizeUom = [{ text }];
			}
			if (row.totalFatPerServingUom) {
				let text = row.totalFatPerServingUom[0].text;
				row.totalFatPerServingUom = [{ text }];
			}
			if (row.saturatedFatPerServingUom) {
				let text = row.saturatedFatPerServingUom[0].text;
				row.saturatedFatPerServingUom = [{ text }];
			}
			if (row.totalCarbPerServingUom) {
				let text = row.totalCarbPerServingUom[0].text;
				row.totalCarbPerServingUom = [{ text }];
			}
			if (row.totalSugarsPerServingUom) {
				let text = row.totalSugarsPerServingUom[0].text;
				row.totalSugarsPerServingUom = [{ text }];
			}
			if (row.proteinPerServingUom) {
				let text = row.proteinPerServingUom[0].text;
				row.proteinPerServingUom = [{ text }];
			}
		}
	}

	const clean = (text) =>
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

	data.forEach((obj) =>
		obj.group.forEach((row) =>
			Object.keys(row).forEach((header) =>
				row[header].forEach((el) => {
					el.text = clean(el.text);
				})
			)
		)
	);

	return data;
};

module.exports = { transform };
