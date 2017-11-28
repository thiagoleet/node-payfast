module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Recebida requisição de teste na porta 3000');
        console.log('Listando todos os pagamentos');
        var connection = app.persistences.connectionFactory();
        var dao = new app.persistences.PagamentoDao(connection);
        dao.lista(function (error, result) {
            console.log('Consulta realizada');
            res.json(pagamento);
        });
    });

    app.post('/pagamentos/pagamento', function (req, res) {
        // Validações
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatório")
            .notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal")
            .notEmpty()
            .isFloat();
        
        var erros = req.validationErrors();
        if(erros) {
            console.log('Erros de validação encontrados');
            res.status(400).send(erros);
            return;
        }

        var pagamento = req.body;
        console.log('Processando uma requisição de um novo pagamento');
        pagamento.status = 'CRIADO';
        pagamento.data = new Date();

        var connection = app.persistences.connectionFactory();
        var dao = new app.persistences.PagamentoDao(connection);
        dao.salva(pagamento, function (error, result) {
            if (error) {
                console.error(error);
                res.status(400).json('Erro ao criar o pagamento');
            }
            else {
                console.log('Pagamento criado');
                res.json(pagamento);
            }
        });

    });
}