# ProjectManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.2.

### Welcome route - max 70 points

- [ ] The welcome page should contain general information about the developer, project, and course. **10 points**
- [ ] In the upper right corner there are 2 buttons: login and sign up. **10 points**
- [ ] If there is an unexpired token, the user should be redirected to the "Main route" of the application automatically. **20 points**
- [ ] When the token expires - the user should be redirected to the "Welcome page" automatically. **20 points**
- [ ] Pressing the Login / Sign up button redirects a user to the route with the Login / Sign up form. **10 points**

### Login / Sign up  - max 80 points

- [ ] Login/log out should be present on all pages **20 points**
- [ ] Form fields should be implemented according to the backend API. Validation should be implemented. **50 points**
- [ ] Upon successful login, the user should be redirected to "Main route" **10 points**

### Main route - max 100 points

- [ ] Board creation functionality **20 points**
- [ ] Displays all created boards as a list **10 points**
- [ ] Each board in the list is displayed with a small preview of available information (title, description, etc). By clicking an element the user navigates to the board item (Board route). There's also a button for board deletion. **10 points**
- [ ] When trying to delete the board, we should receive a confirmation modal. The confirmation modal must be a generic component (one for the entire application). **10 points**
- [ ] Global search: search for a task by a task number, name, users who participate in it, and by the text of the task description. **20 points**
- [ ] The user profile editing functionality is implemented. **30 points**

### Board route - max 260 points

- [ ] Button for column creation is displayed **10 points**
- [ ] If a board contains at least one column - a button for task creation is displayed as well **10 points**
- [ ] A modal window with form is displayed for column and task creation  **30 points**
- [ ] A vertical scrollbar is displayed in the column when overflowing with the number of column tasks  **20 points**
- [ ] The page itself on the current route doesn't have a vertical scrollbar **10 points**
- [ ] With the help of drag-n-drop, we can swap columns. **30 points**
- [ ] With the help of drag-n-drop, we can change the order of tasks within a column.  **30 points**
- [ ] With the help of drag-n-drop, we can change the task belonging to the column.  **50 points**
- [ ] by clicking on the task, we open a modal window with the edit task form. The requirements for the form and window are the same as everywhere else. **30 points**
- [ ] The task must have a delete task button. On click: confirmation modal -> delete.  **10 points**
- [ ] The top of a column should always display the column title. By clicking the title the test should turn into a form with cancel and submit buttons. After typing a text into the input and clicking the submit button the tile of the column should be updated. **20 points**
- [ ] The column should have a delete button. By clicking -> confirmation modal -> when approving -> deleting. **10 points**

### General requirements - max 80 points

- [ ] Backend error handling - (Not found, unhandled rejection, etc) should be performed in a user-friendly way (toast, pop-up or anything else you implement). **50 points**
- [ ] Localization **20 points**
- [ ] Backend is deployed and publicly available **10 points**

### Additiona functionality - 30 points

- [ ] Implemented additional functionality that is not provided for by current requirements **30 points**
