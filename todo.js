(function todo_global() {

  /**
   * A blank task which can be cloned to create new tasks.
   * @type {HTMLElement}
   */
  var task_template = document.querySelector('.task').cloneNode(true);

  /**
   * Finds the nearest element in the document whose subtree represents a task
   * and that encloses a given HTML element.  When called on an element
   * representing subtask, finds the task that it's an immediate subtask of.
   * @param {HTMLElement} element - The element whose corresponding task is
   *   sought.
   * @returns {?HTMLElement} The element whose subtree represents the enclosing
   *   task, or null if the given element is not part of a task subtree.
   */
  var enclosing_task = function enclosing_task(element) {
    for (var enclosing = element.parentNode; enclosing !== document;
      enclosing = enclosing.parentNode) {
        if (enclosing.classList.contains('task')) {
          return enclosing;
        }
      }
    return null;
  };

  /**
   * Finds the first element in the document with a given class that's included
   * in the subtree that represents a given task.  The returned element must
   * correspond directly to that task and not to a subtask.
   * @param {HTMLElement} task - The task element to search within.
   * @param {string} class_name - The class that the sought element must have.
   * @returns {?HTMLElement} The first element with the given class enclosed by
   *   the given task (but not a subtask), or null if there is no such element.
   */
  var enclosed_by_class = function enclosed_by_class(task, class_name) {
    var elements_with_class = task.querySelectorAll('.' + class_name);
    for (var i = 0; i < elements_with_class.length; i++) {
      var element = elements_with_class[i];
      if (enclosing_task(element) === task) {
        return element;
      }
    }
    return null;
  };

  /**
   * Unchecks the boxes for all of this task's direct ancestors.
   * @param {HTMLElement} task - The task whose ancestors are to be unchecked.
   */
  var uncheck_enclosing_tasks = function uncheck_enclosing_tasks(task) {
    for (var enclosing = enclosing_task(task); enclosing !== null;
      enclosing = enclosing_task(enclosing)) {
        enclosed_by_class(enclosing, 'task-done').checked = false;
      }
  };


  // Handle the top-level add button, which creates a new task.
document.getElementById('add-toplevel-task').addEventListener('click',
  function add_toplevel_task() {
    var newTask = task_template.cloneNode(true);
    document.getElementById('toplevel-tasks').appendChild(newTask);
  });


  // Handle non-top-level add and delete buttons.
  document.addEventListener('click', function click_handler(event) {
    var target = event.target;
    if (target.classList.contains('add-subtask')) {
      // A non-top-level add button creates a new task and append it to the
      // subtasks list of the task that encloses it.  Since the new task will
      // initially be unchecked, the enclosing task and all its ancestors will
      // have to be unchecked too.
      var parent_task = enclosing_task(target);
      var subtask = task_template.cloneNode(true);
      enclosed_by_class(parent_task, 'subtasks').appendChild(subtask);
      uncheck_enclosing_tasks(subtask);
    } else if (target.classList.contains('delete-task')) {
      // A delete button deletes the task that encloses it.
      var task_to_remove = enclosing_task(target);
      task_to_remove.parentElement.removeChild(task_to_remove);
    }
  });

  // Handle checking and unchecking of tasks.
  document.addEventListener('change', function change_handler(event) {
    var target = event.target;
    if (target.classList.contains('task-done')) {
      var task = enclosing_task(target);
      if (target.checked) {
        // When a task is checked, all its descendants must be checked.
        var checkboxes = task.querySelectorAll('.task-done');
        for (var i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = true;
        }
      } else {
        // When a task is unchecked, all its ancestors must be unchecked.
        uncheck_enclosing_tasks(task);
      }
    }
  });

})();



/*_________________________________________________________________________________________________*/
/*                                                                                                 */
/*                            Additional Code                                                      */
/*_________________________________________________________________________________________________*/


// toggle if task done - additional for styling purposes - check parent
document.addEventListener('change', function(event) {
  var target = event.target;
  if (target.classList.contains('task-done')) {
    var task = target.closest('.task');
    if (target.checked) {
      task.classList.add('checked');
    } else {
      task.classList.remove('checked');
    }
  }
});

// Dark mode button toggle
document.addEventListener('DOMContentLoaded', function() {

  // find button with classname of button
  const darkModeButton = document.querySelector('.darkMode');
  const body = document.querySelector('body');

  // change when toggle - changes text as well
  darkModeButton.addEventListener('click', function() {
    body.classList.toggle('dark-mode'); 
    if (darkModeButton.innerHTML === "Light Mode") {
      darkModeButton.innerHTML = "Dark Mode";
    } else {
      darkModeButton.innerHTML = "Light Mode";
    }
  });
});

// Toggles the side bar with the 3 bar line at the top left
document.addEventListener('DOMContentLoaded', function() {
  const toggleSideBarCheckbox = document.querySelector('.toggleSideBar');
  const leftTabs = document.querySelector('.leftTabs');
  const mainTodo = document.querySelector('.mainTodo');

  // if toggled, need to change view width of left and right (mainTodo is right)
  toggleSideBarCheckbox.addEventListener('change', function() {

    // toggled off, do not display
    if (toggleSideBarCheckbox.checked) {
     
      leftTabs.style.width = '0vw';
      mainTodo.style.width = '100vw';

      // Hide all children of leftTabs
      Array.from(leftTabs.children).forEach(child => {
        child.style.display = 'none';
      });

    // toggled on, do display
    } else {
      leftTabs.style.width = '15vw';
      mainTodo.style.width = '85vw';
      // Show all children of leftTabs

      // Have to display children as well
      Array.from(leftTabs.children).forEach(child => {
        child.style.display = '';
      });
    }
  });
});



// Toggles display type: grid layout or one column of rows
document.addEventListener('DOMContentLoaded', function() {
  const cardDisplayButton = document.querySelector('.cardDisplay');
  const taskContainer = document.querySelector('.taskContainer');

  cardDisplayButton.addEventListener('click', function() {
    taskContainer.classList.toggle('card-view');
    if (cardDisplayButton.innerHTML === "Row") {
      cardDisplayButton.innerHTML = "Grid";
    } else {
      cardDisplayButton.innerHTML = "Row";
    }
  });
});



// Width slider control
var slider = document.getElementById("myRange");

slider.oninput = function() {

  var sliderValue = this.value;

  // loop through all top level children tasks
  // subtasks look funny with width is also adjusted
  var topLevelTasks = document.querySelectorAll('#toplevel-tasks > .task'); 
  topLevelTasks.forEach(function(task) {
    task.style.width = sliderValue + '%';
  });
};


