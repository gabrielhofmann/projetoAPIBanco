import database from "../bandodedados.js";

class APIController {

    listAccounts(req, res) {
        const password = req.query.senha_banco;
        const bankpassword = database.banco.senha;

        if (password === bankpassword) {
            const accounts = database["contas"];
            res.send(accounts);
        } else {
            res.json({ "mensagem": "A senha do banco informada é inválida!!" })
        }
    }

    createAccount(req, res) {
        const accounts = database["contas"];
        // console.log(accounts)
        const params = req.body;

        const id = accounts.length;

        let checkInvalidData = Boolean;
        let checkExistingAccount = Boolean;

        const newAccount = {
            "id": id,
            "saldo": 0,
            "usuario": {
                "nome": params.nome,
                "cpf": params.cpf,
                "data_nascimento": params.data_nascimento,
                "telefone": params.telefone,
                "email": params.email,
                "senha": params.senha
            }
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
            if (element.usuario.email == newAccount.usuario.email || element.usuario.cpf == newAccount.usuario.cpf) {
                checkExistingAccount = false;
                res.json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
            } else {
                checkExistingAccount = true;
            }
        });

        if (checkInvalidData && checkExistingAccount) {
            accounts.push(newAccount)
            res.json(accounts)
        }
    }

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

    deleteAccount(req, res) {
        const accounts = database["contas"];
        const id = req.params.id;
        const selectedAccount = accounts[id];

        if (selectedAccount == undefined) {
            res.json({ "mensagem": "Conta não existente!!" });
        } else if (selectedAccount.saldo != 0) {
            res.json({ "mensagem": "Saldo diferente de 0!!", "saldo": selectedAccount.saldo });
        } else {
            accounts.splice(id, 1);
            res.json(accounts);
        }

    }

    depositValue(req, res) {
        const accounts = database["contas"];
        const params = req.body;
        const id = params.numero_conta;
        const value = params.valor;
        const selectedAccount = accounts[id];
        
        if (selectedAccount == undefined) {
            res.json({"mensagem": "Conta não existe!!"});
        } else if (id || value == undefined || '') {
            res.json({"mensagem": "O número da conta e o valor são obrigatórios!!"});
        } else if(value < 0) {
            res.json({"mensagem": "O valor deve ser maior que zero!!"})
        } else {
            selectedAccount.saldo += value;

            let depositsList = database["depositos"];
            const date = Date().toLocaleString();
            
            const newDeposit  = {
                "data": date,
                "numero_conta": id,
                "valor": value
            }

            depositsList.push(newDeposit);

            res.json(depositsList);
        }
    }

    withdrawValue(req, res) {
        const accounts = database["contas"];
        const params = req.body;
        const id = params.numero_conta;
        const value = params.valor;
        const password = params.senha;
        let selectedAccount =  accounts[id];

        if (id == undefined || value == undefined || password == undefined) {
            res.json({"mensagem": "Dados inválidos!!"});
        } else if (selectedAccount == undefined) {
            res.json({"mensagem": "Conta não existe!!"});
        } else if (password != selectedAccount.usuario.senha) {
            res.json({"mensagem": "Senha errada!!"});
        } else if (value < 0) {
            res.json({"mensagem": "Valor inválido!!"})
        } else if (value > selectedAccount.saldo) {
            res.json({"mensagem": "Saldo insuficiente!!"});
        } else {
            selectedAccount.saldo -= value;

            let withdrawList = database["saques"];
            const date = Date().toLocaleString();

            const newWithdraw = {
                "data": date,
                "numero_conta": id,
                "valor": value
            }

            withdrawList.push(newWithdraw);
            res.json(withdrawList);
        }
    }
}

export { APIController };