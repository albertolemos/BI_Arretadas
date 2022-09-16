export function validateLogin(user, password){
    if (user.length < 5) {
        return 'Preencha corretamente o campo Usuário com pelo menos 5 caracteres!'
    } else if (password.length < 5) {
        return 'Preencha corretamente o campo Senha com pelo menos 5 caracteres!'
    }
    return "";
}