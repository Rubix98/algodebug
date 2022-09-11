export class ButtonsFactory {
  static buttonOK(label, action) {
    return {
      class: 'ok',
      label: label,
      action: action
    }
  }
}