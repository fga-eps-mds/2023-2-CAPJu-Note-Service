import models from '../models/_index.js';
import NoteService from './note.js';
import ProcessAudService from './processAudService.js';
import UserService from './user.js';

const noteService = new NoteService(models.Note);
const processAudService = new ProcessAudService(models.ProcessAud);
const userService = new UserService();

const services = {
  noteService: noteService,
  processAudService,
  userService,
};

export default services;
