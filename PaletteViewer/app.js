const app = document.getElementById('app');

fetch('./output.json')
    .then((response) => {
        if (response.ok) return response.json()
        else throw new Error('Problem when fetching data...');
    })
    .then((data) => {
        createDOM(data)
    })
    .catch((error) => {
        console.error(error)
    })

function createDOM(data) {
    for (let i = 0; i < data.length; i++) {
        const paletteContainer = document.createElement('div');
        paletteContainer.classList.add('palette-container');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');
        const img = document.createElement('img');
        img.src = `../CreatePalette/${data[i].file.split(/\/(.*)/s)[1]}`
        img.classList.add('img');
        imgContainer.appendChild(img);
        paletteContainer.appendChild(imgContainer);

        const colorContainer = document.createElement('div');
        colorContainer.classList.add('color-container');
        const title = document.createElement('h2');
        title.classList.add('palette-title');
        title.innerText = `Palette for image [${data[i].file.split('/')[2]}]`;
        colorContainer.appendChild(title);

        const totalPercentage = data[i].palette.reduce((total, currentPalette) => total += currentPalette.occurrencesPercentage, 0);
        let totalNormalizedPercentage = 0;

        const table = document.createElement('table');
        const swatchHeader = document.createElement('th');
        const hexHeader = document.createElement('th');
        hexHeader.innerText = 'Color code';
        const occurrencesHeader = document.createElement('th');
        occurrencesHeader.innerText = 'Number of occurrences';
        const percentageHeader = document.createElement('th');
        percentageHeader.innerText = 'Percentage';
        const normalizedHeader = document.createElement('th');
        normalizedHeader.innerText = 'Percentage rounded to 5%';
        const inputHeader = document.createElement('th');
        inputHeader.innerText = 'Color name'

        const th = document.createElement('tr');
        th.append(swatchHeader, hexHeader, occurrencesHeader, percentageHeader, normalizedHeader, inputHeader);
        table.appendChild(th);

        for (let j = 0; j < data[i].palette.length; j++) {
            const row = document.createElement('tr');
            const swatchCell = document.createElement('td');
            swatchCell.classList.add('swatch-cell')
            const hexCell = document.createElement('td');
            hexCell.classList.add('hex-cell');
            hexCell.dataset.color = data[i].palette[j].hexValue;
            const occurrencesCell = document.createElement('td');
            const percentageCell = document.createElement('td');
            const normalizedCell = document.createElement('td');
            const inputCell = document.createElement('td');
            inputCell.classList.add('input-cell')

            const swatch = document.createElement('div');
            swatch.classList.add('swatch');
            swatch.style.background = data[i].palette[j].hexValue;
            swatchCell.appendChild(swatch);

            hexCell.innerText = data[i].palette[j].hexValue;
            occurrencesCell.innerText = Number(data[i].palette[j].occurrences).toLocaleString();
            percentageCell.innerText = Number(data[i].palette[j].occurrencesPercentage).toLocaleString(undefined, {
                style: 'percent',
                minimumFractionDigits: 2
            });

            const normalizedPercentage = data[i].palette[j].occurrencesPercentage * 1 / totalPercentage;
            totalNormalizedPercentage += Math.round(normalizedPercentage * 100 / 5) * 5 / 100
            normalizedCell.innerText = Number(Math.round(normalizedPercentage * 100 / 5) * 5 / 100).toLocaleString(undefined, {
                style: 'percent',
                minimumFractionDigits: 2
            });

            const input = document.createElement('input');
            input.classList.add('color-name-input');
            input.dataset.file = data[i].file;
            input.dataset.colorCode = data[i].palette[j].hexValue
            inputCell.appendChild(input);

            row.append(swatchCell, hexCell, occurrencesCell, percentageCell, normalizedCell, inputCell);
            table.appendChild(row);
        }

        const footerRow = document.createElement('tr');
        const swatchCell = document.createElement('td');
        const hexCell = document.createElement('td');
        const occurrencesCell = document.createElement('td');
        const percentageCell = document.createElement('td');
        percentageCell.classList.add('bold');
        percentageCell.innerText = Number(totalPercentage).toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 2
        });

        const normalizedCell = document.createElement('td');
        normalizedCell.classList.add('bold');
        normalizedCell.innerText = Number(totalNormalizedPercentage).toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 2
        });

        footerRow.append(swatchCell, hexCell, occurrencesCell, percentageCell, normalizedCell);
        table.appendChild(footerRow);

        colorContainer.appendChild(table);

        paletteContainer.appendChild(colorContainer)
        app.appendChild(paletteContainer);
    }

    document.querySelectorAll('.hex-cell').forEach(cell => cell.addEventListener('click', copyToClipboard))

}

function copyToClipboard(event) {
    navigator.clipboard.writeText(event.target.dataset.color.substring(1));
}

document.getElementById('downloadButton').addEventListener('click', download)
document.getElementById('upload').addEventListener('change', onUpload)

function download() {
    const contentType = 'text/plain';
    let content = JSON.stringify(createContent());

    const fileName = 'color-names.json';

    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function createContent() {
    let output = [];
    document.querySelectorAll('.color-name-input').forEach(input => {
        output.push({
            'file': input.dataset.file,
            'colorName': input.value,
            'colorCode': input.dataset.colorCode
        })
    });
    return output;
}

function onUpload(event) {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
    const colorNames = JSON.parse(event.target.result);

    document.querySelectorAll('.color-name-input').forEach(input => {
        input.value = colorNames.find(colorName => colorName.file === input.dataset.file && colorName.colorCode === input.dataset.colorCode).colorName
    })
}

window.onbeforeunload = (e) => {

    return false
};
