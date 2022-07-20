export class DialogsFactory {
  static get(dialog, sendRequest) {
    return DialogsFactory[dialog](sendRequest);
  }
  
  static SaveProjectDialog = function() {
    return {
      key: 'SaveProjectDialog',
      type: 'SaveProjectDialog',
      title: 'Zapisz projekt'
    };
  }

  static SelectProjectDialog = async function(sendRequest) {
    let projects = await sendRequest("BACKEND/project/findAll");

    return {
      key: 'SelectProjectDialog',
      type: 'SelectListDialog',
      title: 'Otwórz gotowy projekt',
      options: projects.data
    };
  }

  static SelectVariableTypeDialog = function() {
    let options = [
      {key: 'Variable', dialogData: {label: 'Zwykła zmienna'}},
      {key: 'Graph', dialogData: {label: 'Teoria grafów'}},
      {key: 'Geometry', dialogData: {label: 'Geometria 2D'}},
      {key: 'Arrays', dialogData: {label: 'Tablice'}},
    ];
    
    return {
      key: 'SelectVariableTypeDialog',
      type: 'SelectListDialog',
      title: 'Wybierz rodzaj zmiennej',
      options: {
        dialogData: options
      },
      nextDialog: (selectedOption) => {
        if (selectedOption.key !== 'Variable') {
          return 'SelectVariableConstructorDialog'
        }
      }
    }
  }

  static SelectVariableConstructorDialog = async function(sendRequest) {
    let constructors = await sendRequest("BACKEND/constructor/findAll");

    return {
      key: 'SelectVariableConstructorDialog',
      type: 'SelectListDialog',
      title: 'Wybierz konstruktor',
      options: constructors.data
    }
  }
}