var TodoList = (function() {
  var items = {}
  var currentCount = 1
  return {
    getItems: () => items,
    addItem: (taskString) => {
      var item = {}
      item.task = taskString
      item.id = currentCount
      items[currentCount] = item
      currentCount++
      return items
    }
  }
})()

var DOMElements = {
  addTaskButton: () => document.querySelector('.new-task-button'),
  newTaskInputField: () => document.querySelector('.new-task-input-field'),
  tasksTableBody: () => document.querySelector('.tasks-body')
}

var UI = {
  refreshTodolist: (items) => {
    var itemsHTML = Object.values(items).map(item => {
      return `
      <tr>
        <td>${item.id}</td>
        <td>${item.task}</td>
      </tr>
`
    }).join('\n');
    DOMElements.tasksTableBody().innerHTML = itemsHTML
  },
  addItem: () => {
  }
}

var Controller = {
  addItem: (event) => {
    let task = DOMElements.newTaskInputField().value
    var items = TodoList.addItem(task)
    UI.refreshTodolist(items)
  }
};

DOMElements.addTaskButton().addEventListener('click', Controller.addItem)

// console.log(TodoList.addItem('Do the dishes'))
// console.log(TodoList.addItem('Call mom'))
// console.log('getItems::', TodoList.getItems());
