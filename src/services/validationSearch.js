export function validateSearch(selectedType, selectedTypeComplaint, initialDate, finalDate){
    const dataAtual = new Date();
    if (!initialDate || !finalDate || !selectedType) {
        return "Por favor, preencha os campos corretamentes!"
    } else if (selectedType === "Denúncias" && selectedTypeComplaint.length === 0) {
        return "Por favor, escolha o Tipo de denúncia!"
    } else if (finalDate < initialDate) {
        return "Por favor, informe a data final maior que data inicial!"
    } else if(finalDate > dataAtual) {
        return "Por favor, a Data final não pode ser maior que data atual!"
    }
    return "";
}
