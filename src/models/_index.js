import NoteModel from './note.js';
import ProcessModel from "./process.js";
import ProcessAudModel from "./processAud.js";
import User from "./user.js";

const Note = NoteModel;
const Process = ProcessModel;
const ProcessAud = ProcessAudModel;

const models = {
  Note,
  Process,
  User,
  ProcessAud,
};

User.associate(models);
ProcessAud.associate(models);

export default models;
