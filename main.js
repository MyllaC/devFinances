/* ABRIR E FECHAR O MODAL */
const Modal = {
  //tentar usar o toggle
  open() {
    //abrir modal e adicionar a class active ao modal
    document
      .querySelector('.modal-overlay') // usa ponto para classe
      .classList.add('active') //adicionar a propriedade active na classe que o querySlelector pegou
  },
  close() {
    //fechar modal
    //remover a class active do modal
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}

/* VALORES CADASTRADOS DE ENTRADA E SAÍDA, vão ficar em uma local storage */

/* SOMA DAS ENTRADAS, SAÍDAS E TOTAL */
const Transaction = {
  all: [
    {
      description: 'Luz',
      amount: -50001, //depois vamos formatar esse valor para ele ficar 500 reais
      date: '23/01/2021'
    },
    {
      description: 'Website',
      amount: 500000, //depois vamos formatar esse valor para ele ficar 500 reais
      date: '23/01/2021'
    },
    {
      description: 'Internet',
      amount: -20012, //depois vamos formatar esse valor para ele ficar 500 reais
      date: '23/01/2021'
    },
    {
      description: 'App',
      amount: 200000, //depois vamos formatar esse valor para ele ficar 500 reais
      date: '23/01/2021'
    }
  ],

  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)
    App.reload()
  },

  incomes() {
    // somar as entradas
    let income = 0
    Transaction.all.forEach(transacion => {
      //para cada transação, se for maior que zero somar a uma variavel e retornar a variavel
      if (transacion.amount > 0) {
        income += transacion.amount
      }
    })

    return income
  },
  expenses() {
    //somar todas as saídas
    let expense = 0
    Transaction.all.forEach(transacion => {
      //para cada transação, se for menor que zero somar a uma variavel e retornar a variavel
      if (transacion.amount < 0) {
        expense += transacion.amount
      }
    })
    return expense
  },
  total() {
    //total = entradas - saídas
    return Transaction.incomes() + Transaction.expenses()
  }
}

/* SUBSTITUIR OS DADOS DO HTML COM OS DADOS DO JS */
const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction) {
    //definir se a classe é income ou expense
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    //Pegar o amount já convertido
    const amount = Utils.formatCurrency(transaction.amount)

    //Modelo que estava no HTML
    const html = ` 
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover transação" />
      </td>
    `
    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    )
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    )
  },

  clearTransactions() {
    DOM.transactionContainer.innerHTML = ''
  }
}

/* CONVERSOR DO AMOUNT PARA MOEDA */
const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')
    /*troca todos os zeros da string pelo elemento depois da vírgula -> /0/g, sem o g ele trocaria só o primeiro zero 
    /\D/g expressão para achar tudo que não for número */

    value = Number(value) / 100

    // Converter para moeda
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

const App = {
  init() {
    /* REPETIÇÃO PARA PEGAR CADA OBJETO DO MEU ARRAY */
    Transaction.all.forEach(transaction => {
      DOM.addTransaction(transaction)
    })

    DOM.updateBalance()
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
