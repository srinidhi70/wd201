function todoList() {
  const all = [];

  function add(todoItem) {
    all.push(todoItem);
  }

  function markAsComplete(index) {
    all[index].completed = true;
  }

  function overdue() {
    const today = new Date().toISOString().split("T")[0];
    return all.filter(
      item =>
        item.dueDate < today &&
        item.completed === false
    );
  }

  const dueToday = () => {
    const today = new Date();
    return all.filter(
      (item) => item.dueDate === today.toISOString().split("T")[0]
    );
  };

  function dueLater() {
    const today = new Date().toISOString().split("T")[0];
    return all.filter(
      item =>
        item.dueDate > today &&
        item.completed === false
    );
  }

  function toDisplayableList(items) {
    return items
      .map(item => {
        const isCompleted = item.completed ? "[x]" : "[ ]";
        return `${isCompleted} ${item.title} ${
          item.dueDate !== new Date().toISOString().split("T")[0]
            ? item.dueDate
            : ""
        }`;
      })
      .join("\n");
  }

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
}

module.exports = todoList;
