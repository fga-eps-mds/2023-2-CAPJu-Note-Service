import NoteModel from './note.js';
import ProcessModel from './process.js';
import ProcessAudModel from './processAud.js';
import User from './user.js';
import RoleModel from './role.js';
import UnitModel from './unit.js';

const Note = NoteModel;
const Process = ProcessModel;
const ProcessAud = ProcessAudModel;
const Role = RoleModel;
const Unit = UnitModel;

const models = {
  Note,
  Process,
  User,
  ProcessAud,
  Role,
  Unit,
};

User.associate(models);
ProcessAud.associate(models);

export default models;
