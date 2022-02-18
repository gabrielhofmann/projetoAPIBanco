import database from '../bandodedados.js';

class TransactionsController {
    updateAccount(req, res) {
        const accounts = database["contas"];
        const params = req.body;
        const id = req.params.id;
        const selectedAccount = accounts.find(acc => acc.id == id);
        let checkInvalidData = Boolean;
        let checkExistingAccount = Boolean;

        //Check if account exists
        if (selectedAccount === undefined) {
            res.json({ "mensagem": "Conta não existente!!" });
        } else {

            //Check if data is valid
            if (params.nome && params.cpf && params.data_nascimento && params.telefone && params.email && params.senha != null || undefined || '') {
                checkInvalidData = true;
            } else {
                checkInvalidData = false;
                res.json({ "mensagem": "Dados inválidos!!" })
            }

            const isEmailDuplicate = accounts.find(acc => acc.usuario.email == params.email);

            const isCPFDuplicate = accounts.find(acc => acc.usuario.cpf == params.cpf);

            console.log(isEmailDuplicate, isCPFDuplicate)

            if (isEmailDuplicate == undefined && isCPFDuplicate == undefined) {
                checkExistingAccount = true;
            } else {
                checkExistingAccount = false;
                res.json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })
            }
        }

        if (checkInvalidData && checkExistingAccount) {
            const balance = selectedAccount.saldo;

            const updatedAccount = {
                "id": id,
                "saldo": balance,
                "usuario": {
                    "nome": params.nome,
                    "cpf": params.cpf,
                    "data_nascimento": params.data_nascimento,
                    "telefone": params.telefone,
                    "email": params.email,
                    "senha": params.senha
                }
            }

            accounts[id] = updatedAccount;
            res.json(accounts[id]);
        }
    }
}

export { TransactionsController };