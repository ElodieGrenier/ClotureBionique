// Calcul du total
function calculateTotal() {
    const materialSelect = document.getElementById('material');
    const materialPrice = parseFloat(materialSelect.selectedOptions[0].dataset.price) || 0;
    const materialName = materialSelect.value;
    const perimeter = parseFloat(document.getElementById('perimeter').value) || 0;

    let total = materialPrice * perimeter;

    // Extras
    const extras = document.querySelectorAll('.extra:checked');
    let extrasList = [];
    extras.forEach(extra => {
        if (extra.id === 'removal') {
            total += parseFloat(extra.value) * perimeter;
        } else {
            total += parseFloat(extra.value);
        }
        extrasList.push(extra.nextElementSibling.innerText);
    });

    if (extrasList.length === 0) extrasList.push("Aucun");

    document.getElementById('totalPrice').innerText = total.toLocaleString('fr-CA');

    // Stocker pour le PDF
    window.estimationData = {
        materialName,
        perimeter,
        extras: extrasList,
        total
    };
}

// Génération PDF
document.getElementById('downloadPDF').addEventListener('click', function () {
    if (!window.estimationData) {
        alert("Veuillez d'abord calculer l'estimation !");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Logo en haut
    doc.addImage('images/logo.png', 'PNG', 15, 10, 40, 15);

    // Titre
    doc.setFontSize(18);
    doc.text("Estimation de projet Clôtures Bionique", 60, 20);

    // Infos
    doc.setFontSize(14);
    doc.text(`Matériau choisi: ${window.estimationData.materialName}`, 20, 40);
    doc.text(`Périmètre total: ${window.estimationData.perimeter} m`, 20, 50);
    doc.text(`Options: ${window.estimationData.extras.join(', ')}`, 20, 60);
    doc.text(`Estimation totale: ${window.estimationData.total.toLocaleString('fr-CA')} $`, 20, 70);

    doc.save("Estimation_CloturesBionique.pdf");
});
