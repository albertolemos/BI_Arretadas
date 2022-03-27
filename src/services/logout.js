// Método para fazer o logout, evitar repetição do código
export function logoutUser() {
    sessionStorage.removeItem("token");
}