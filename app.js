const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const remaining = document.getElementById('remaining');
const clearBtn = document.getElementById('clear-btn');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateFooter() {
  const count = tasks.filter(t => !t.done).length;
  remaining.textContent = `${count} task${count !== 1 ? 's' : ''} remaining`;
}

function render() {
  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks[i].done = checkbox.checked;
      save();
      render();
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✕';
    del.addEventListener('click', () => {
      tasks.splice(i, 1);
      save();
      render();
    });

    li.append(checkbox, span, del);
    taskList.appendChild(li);
  });
  updateFooter();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = '';
  save();
  render();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});
clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

render();
