import models from '../models/_index.js';
import NoteService from './note.js';
import ProcessAudService from './processAudService.js';

const noteService = new NoteService(models.Note);
const processAudService = new ProcessAudService(models.ProcessAud);

const services = {
  noteService: noteService,
  processAudService,
};

export default services;
