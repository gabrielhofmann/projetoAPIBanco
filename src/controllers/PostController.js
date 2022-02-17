import database from "../bandodedados.js";

class PostController {
    createAccount(req, res) {
        const accounts = database["contas"];
        const params = req.body;
        let checkInvalidData = Boolean;
        let checkExistingAccount = Boolean;

        const newAccount = {
            "nome": params.nome,
            "cpf": params.cpf,
            "data_nascimento": params.data_nascimento,
            "telefone": params.telefone,
            "email": params.email,
            "senha": params.senha
        }

        //Check if data is valid
        if (params.nome && params.cpf && params.data_nascimento && params.telefone && params.email && params.senha != null || undefined || '') {
            checkInvalidData = true;
        } else {
            checkInvalidData = false;
            res.json({ "mensagem": "Dados inválidos!!" })
        }

        //Check if email or cpf already exists
        accounts.forEach(element => {
            if (element.email === newAccount.email || element.cpf === newAccount.cpf) {
                checkExistingAccount = false;
                res.json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
            } else {
                checkExistingAccount = true;
            }
        });

        if (checkInvalidData && checkExistingAccount) {
            accounts.push(newAccount)
            // res.json(accounts)
        }
    }
}

export { PostController };