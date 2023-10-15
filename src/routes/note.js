import express from 'express';
import controllers from '../controllers/_index.js';
import {authenticate} from "../../middleware/authMiddleware.js";

const NoteRoutes = express.Router();

NoteRoutes.get('/:idProcess', authenticate, controllers.noteController.index);
NoteRoutes.post('/newNote', authenticate, controllers.noteController.newNote);
NoteRoutes.put('/updateNote/:idNote', authenticate, controllers.noteController.update);
NoteRoutes.delete('/deleteNote/:idNote', authenticate, controllers.noteController.delete);

export default NoteRoutes;
