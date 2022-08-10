export class ButtonsFactory {
  static buttonOK(label, action) {
    return {
      class: 'algo-button-ok',
      label: label,
      action: action
    }
  }
}