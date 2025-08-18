
## Vision: Andy OS a retro computer to teach me about front-end and back-end.

Done:
- Windows with emojis and basic CSS

To-do:
- Be able to open a window with the text editor and save a file
  - We need a local file system, some interface to access the files that gets rendered, a button to save the files


___

### Backend (Go)

1.  [ ] Create a `data` directory in `backend` for file storage.
2.  [ ] Add the Gin web framework to `go.mod`.
3.  [ ] Implement a `POST /api/save` endpoint in `main.go` to save file content.
4.  [ ] Implement a `GET /api/files` endpoint to list saved files.
5.  [ ] Implement a `GET /api/files/:filename` endpoint to load a specific file.
6.  [ ] Add CORS middleware to allow frontend requests.

### Frontend (React)

1.  [ ] Add a "Save" button to the `Window.tsx` component.
2.  [ ] Add state to manage the text area content.
3.  [ ] Implement the `onSave` function to send a `fetch` request to the backend.
4.  [ ] (Optional) Add a file list to the UI to open existing files.
5.  (Optional) Display loading/saving/error messages to the user.
