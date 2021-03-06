const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

// roteador.options('/', (req, res) => {

// })

roteador.get('/', async (req, res) => {
     const resultados = await TabelaFornecedor.listar()
     res.status(200)
     const serializador = new SerializadorFornecedor(
          res.getHeader('Content-Type'), ['empresa']
     )
     res.send(
          serializador.serializar(resultados)
     )
})
roteador.post('/', async (req, res, proximo) => {
     try {
          const dadosRecebidos = req.body
          const forncedor = new Fornecedor(dadosRecebidos)
          await forncedor.criar()
          res.status(201)
          const serializador = new SerializadorFornecedor(
               res.getHeader('Content-Type'), ['empresa']
          )
          res.send(
               serializador.serializar(forncedor)
          )
     } catch(erro) {
          proximo(erro)
     }
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
     try {
          const id = req.params.idFornecedor
          const forncedor = new Fornecedor({ id:id })
          await forncedor.carregar()
          res.status(200)
          const serializador = new SerializadorFornecedor(
               res.getHeader('Content-Type'),
               ['email', 'empresa', 'dataCriacao', 'dataAtualizacao', 'versao']
          )
          res.send(
               serializador.serializar(forncedor)
          )
     } catch(erro) {
          proximo(erro)
     }
})

roteador.put('/:idFornecedor', async (req, res, proximo) => {
     try{
          const id = req.params.idFornecedor
          const dadosRecebidos = req.body
          const dados = Object.assign({}, dadosRecebidos, {id: id})
          const forncedor = new Fornecedor(dados)
          await forncedor.atualizar()
          res.status(204)
          res.end()
     } catch(erro) {
          proximo(erro)
     }
})
roteador.delete('/:idFornecedor', async (req, res, proximo) => {
     try{
          const id = req.params.idFornecedor
          const forncedor = new Fornecedor({ id:id })
          await forncedor.carregar()
          await forncedor.remover()
          res.status(204)
          res.end()
     } catch(erro) {
          proximo(erro)
     }
})
const roteadorProdutos = require('./produtos')

const verificadorFornecedor = async (req, res, proximo) => {
     try{
          const id = req.params.idFornecedor
          const fornecedor = new Fornecedor({ id:id })
          await fornecedor.carregar()
          req.fornecedor = fornecedor
          proximo()
     } catch(erro) {
          proximo(erro)
     }
}

roteador.use('/:idFornecedor/produtos',verificadorFornecedor, roteadorProdutos)

module.exports = roteador