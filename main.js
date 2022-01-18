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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
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
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" />
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
  formatAmount(value) {
    value = Number(value.replace(/\,\./g, '')) * 100
    return value
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

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

/* FORMULARIO */
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()
    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      // o trim serve para fazer uma limpeza de espaços vazios de sua string, assim eu estou verificarndo se o description ou o amount ou o date estão vazios, se um deles estiver vazio:
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    event.preventDefault() // Não fazer o comportamento padrão que é o de enviaar o formulário com um monte de informaçãoes

    try {
      //verificar se todas as informações foram preenchidas
      Form.validateFields()

      // formatar o dados para Salvar
      const transaction = Form.formatValues()

      //Salvar
      Transaction.add(transaction)

      //Apaguar os dados do formulário para receber novas informações
      Form.clearFields()

      //fechar o modal
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    /* REPETIÇÃO PARA PEGAR CADA OBJETO DO MEU ARRAY */
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
