const Modal = {
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
