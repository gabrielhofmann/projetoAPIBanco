import database from "../bandodedados.js";

class GetController {

    listAccounts(req, res) {
        const password = req.query.senha_banco;


        if(password === "Cubos123Bank") {
            const accounts = database["contas"];            
            res.send(accounts);
        } else {
            res.json({ "mensagem": "A senha do banco informada é inválida!!" })
        }
    }
}

export { GetController };