const TodoFactory = artifacts.require('TodoFactory');
const utils = require("./utils.js");

const Todo1 = {
  taskName: 'Task1',
};

const Todo2 = {
  taskName: 'Task2',
};

contract('TodoFactory', function(accounts) {
  let contract;
  let todoId1;
  let todoId2;

  before(async () => {
    contract = await TodoFactory.deployed();
  });

  it('Should contract deployed properly', async () => {
    assert.isDefined(contract);
  });

  it('Should add new todo properly', async () => {
    const tx1 = await contract.addTodo(Todo1.taskName);
    const events1 = utils.getEvents(tx1, { event: 'OnTodoAdded', logIndex: 0 });
    todoId1 = events1[0].args.todoId;

    const tx2 = await contract.addTodo(Todo2.taskName);
    const events2 = utils.getEvents(tx2, { event: 'OnTodoAdded', logIndex: 0 });
    todoId2 = events2[0].args.todoId;

    const result = await contract.getTodoList();
    const numOfTodos = result[0].length;
    assert.notEqual(todoId1, todoId2);
    assert.equal(numOfTodos, 2);
  });

  it('Should get todo properly', async () => {
    const result = await contract.getTodo(todoId1);

    const taskName = result[0];
    const isComplete = result[1];
    assert.equal(taskName, Todo1.taskName);
    assert.equal(isComplete, false);
  });

  it('Should complete todo properly', async () => {
    await contract.completeTodo(todoId1);

    const result = await contract.getTodoList();
    const numOfCompletedTodos = result[1].filter(isComplete => isComplete).length;

    assert.equal(numOfCompletedTodos, 1);
  });

  it('Should not complete invalid task', async () => {
    let thrownInvalidComplete = false;
    try {
      await contract.completeTodo(9527)
    } catch (e) {
      thrownInvalidComplete = true;
    }
    assert.isTrue(thrownInvalidComplete);
  });

  it('Should delete todo properly', async () => {
    await contract.deleteTodo(todoId1);

    const result = await contract.getTodoList();
    const numOfTodos = result[0].length;

    assert.equal(numOfTodos, 1);
  });

  it('Should not delete invalid todo', async () => {
    let thrownInvalidDelete = false;
    try {
      await contract.deleteTodo(9527);
    } catch (e) {
      thrownInvalidDelete = true;
    }
    assert.isTrue(thrownInvalidDelete);
  });

  it('Should not delete todo twice', async () => {
    let thrownInvalidDelete = false;
    try {
      await contract.deleteTodo(todoId1);
    } catch (e) {
      thrownInvalidDelete = true;
    }
    assert.isTrue(thrownInvalidDelete);
  });
});