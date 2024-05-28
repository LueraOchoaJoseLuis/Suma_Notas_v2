window.onload = function() {
    const inputTable = document.getElementById('inputTable');
    const resultado = document.getElementById('resultado');
    const addButton = document.getElementById('addButton');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const downloadButton = document.getElementById('downloadButton');
    const fileInput = document.getElementById('fileInput');
    let suma = 0;
    let inputCounter = 1;

    function updateSuma() {
        suma = 0;
        const numeroInputs = document.querySelectorAll('.numero');
        numeroInputs.forEach(input => {
            const valor = parseFloat(input.value);
            if (!isNaN(valor)) {
                suma += valor;
            }
        });
        resultado.textContent = suma + ' €';
    }

    inputTable.addEventListener('input', function(event) {
        if (event.target.classList.contains('numero')) {
            updateSuma();
        }
    });

    addButton.addEventListener('click', function() {
        inputCounter++;
        const row = document.createElement('tr');
        row.classList.add('input-group');

        const nombreCell = document.createElement('td');
        const nombreInput = document.createElement('input');
        nombreInput.setAttribute('type', 'text');
        nombreInput.setAttribute('placeholder', 'nombre');
        nombreInput.setAttribute('id', 'nombre' + inputCounter);

        const numeroCell = document.createElement('td');
        const numeroInput = document.createElement('input');
        numeroInput.setAttribute('type', 'text');
        numeroInput.setAttribute('placeholder', 'numero');
        numeroInput.setAttribute('id', 'numero' + inputCounter);
        numeroInput.classList.add('numero');

        nombreCell.appendChild(nombreInput);
        numeroCell.appendChild(numeroInput);

        row.appendChild(nombreCell);
        row.appendChild(numeroCell);

        inputTable.appendChild(row);
    });

    deleteAllButton.addEventListener('click', function() {
        inputTable.innerHTML = '';
        const initialRow = document.createElement('tr');
        initialRow.classList.add('input-group');

        const initialNombreCell = document.createElement('td');
        const initialNombreInput = document.createElement('input');
        initialNombreInput.setAttribute('type', 'text');
        initialNombreInput.setAttribute('placeholder', 'nombre');
        initialNombreInput.setAttribute('id', 'nombre1');

        const initialNumeroCell = document.createElement('td');
        const initialNumeroInput = document.createElement('input');
        initialNumeroInput.setAttribute('type', 'text');
        initialNumeroInput.setAttribute('placeholder', 'numero');
        initialNumeroInput.setAttribute('id', 'numero1');
        initialNumeroInput.classList.add('numero');

        initialNombreCell.appendChild(initialNombreInput);
        initialNumeroCell.appendChild(initialNumeroInput);

        initialRow.appendChild(initialNombreCell);
        initialRow.appendChild(initialNumeroCell);

        inputTable.appendChild(initialRow);
        updateSuma();
    });

    downloadButton.addEventListener('click', function() {
        const rows = document.querySelectorAll('.input-group');
        const data = [];

        rows.forEach(row => {
            const nombreInput = row.querySelector('td:nth-child(1) input[type="text"]');
            const numeroInput = row.querySelector('td:nth-child(2) input[type="text"]');
            if (nombreInput && numeroInput) {
                const nombre = nombreInput.value;
                const numero = numeroInput.value;
                data.push({ nombre, numero });
            }
        });

        const blob = new Blob([JSON.stringify({ data, total: suma }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cuentas.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const content = JSON.parse(event.target.result);
            const data = content.data;
            suma = content.total;

            inputTable.innerHTML = '';
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.classList.add('input-group');

                const nombreCell = document.createElement('td');
                const nombreInput = document.createElement('input');
                nombreInput.setAttribute('type', 'text');
                nombreInput.setAttribute('placeholder', 'nombre');
                nombreInput.setAttribute('id', 'nombre' + (index + 1));
                nombreInput.value = item.nombre;

                const numeroCell = document.createElement('td');
                const numeroInput = document.createElement('input');
                numeroInput.setAttribute('type', 'text');
                numeroInput.setAttribute('placeholder', 'numero');
                numeroInput.setAttribute('id', 'numero' + (index + 1));
                numeroInput.classList.add('numero');
                numeroInput.value = item.numero;

                nombreCell.appendChild(nombreInput);
                numeroCell.appendChild(numeroInput);

                row.appendChild(nombreCell);
                row.appendChild(numeroCell);

                inputTable.appendChild(row);
            });

            updateSuma();
        };

        reader.readAsText(file);
    });
};
