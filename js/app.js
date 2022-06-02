const todoApp = angular.module("todoApp", []);

const generateId = () => {
  return Math.floor(Math.random() * 100000) + 1;
};

const saveTodos = (todos) => {
  let safeTodos = todos.map((item) => {
    return {
      id: item.id,
      body: item.body,
    };
  });

  localStorage.setItem("todos", JSON.stringify(safeTodos));
};

const getTodos = () => {
  let todos = JSON.parse(localStorage.getItem("todos"));
  if (todos === null) return [];
  return todos;
};

todoApp.controller("todoController", ($scope) => {
  // todo format = [{id: 3343434, body: 'task 1'}, ...]
  $scope.todos = getTodos();
  $scope.state = "Add"; // or "Edit"
  $scope.input = "";
  $scope.isInputEmpty = () => {
    return $scope.input.length > 0;
  };
  $scope.editId = null;

  $scope.addEditTodo = () => {
    if ($scope.state === "Add") {
      $scope.addTodo();
    } else if ($scope.state === "Edit") {
      $scope.editTodo();
    }
  };

  $scope.addTodo = () => {
    let id = generateId();
    $scope.todos.push({
      id,
      body: $scope.input,
    });
    $scope.input = "";
    saveTodos($scope.todos);
  };

  $scope.editTodo = () => {
    let id = $scope.editId;
    if (id === null) return;

    let todo = $scope.todos.find((item) => item.id === id);
    todo.body = $scope.input;
    let newTodos = [...$scope.todos];
    $scope.todos.forEach((item, index) => {
      if (item.id === id) {
        newTodos[index] = todo;
      }
    });
    $scope.todos = newTodos;

    $scope.state = "Add";
    $scope.input = "";
    saveTodos($scope.todos);
  };

  $scope.removeTodo = (id) => {
    // Bug fixed
    if (id === $scope.editId) {
      $scope.state = "Add";
      $scope.input = "";
    }
    let newTodos = $scope.todos.filter((item) => item.id !== id);
    $scope.todos = newTodos;
    saveTodos($scope.todos);
  };

  $scope.editState = (id, body) => {
    $scope.state = "Edit";
    $scope.editId = id;
    $scope.input = body;
  };
});
