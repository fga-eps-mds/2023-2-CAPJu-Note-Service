import { Op } from 'sequelize';
import NoteService from '../../../src/services/note.js';
import models from '../../../src/models/_index.js';

describe('NoteService', () => {
  let noteService;
  let NoteModelMock;

  beforeEach(() => {
    NoteModelMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    noteService = new NoteService(NoteModelMock);
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const noteData = {
        // provide necessary data for creating a note
      };

      NoteModelMock.create.mockResolvedValue(noteData);

      const result = await noteService.createNote(noteData);

      expect(result).toEqual(noteData);
      expect(NoteModelMock.create).toHaveBeenCalledWith(noteData);
    });
  });

  describe('findAllByRecord', () => {
    it('should find all notes by record', async () => {
      const record = 'exampleRecord';

      NoteModelMock.findAll.mockResolvedValue([]);

      const result = await noteService.findAllByRecord(record);

      expect(result).toEqual([]);
      expect(NoteModelMock.findAll).toHaveBeenCalledWith({
        where: { record },
      });
    });
  });

  describe('findAllByIdProcess', () => {
    it('should find all notes by idProcess', async () => {
      const idProcess = 'exampleIdProcess';

      NoteModelMock.findAll.mockResolvedValue([]);

      const result = await noteService.findAllByIdProcess(idProcess);

      expect(result).toEqual([]);
      expect(NoteModelMock.findAll).toHaveBeenCalledWith({
        where: { idProcess },
      });
    });
  });

  describe('findOneById', () => {
    it('should find a note by idNote', async () => {
      const idNote = 'exampleIdNote';
      const noteData = {
        // provide necessary data for the found note
      };

      NoteModelMock.findOne.mockResolvedValue(noteData);

      const result = await noteService.findOneById(idNote);

      expect(result).toEqual(noteData);
      expect(NoteModelMock.findOne).toHaveBeenCalledWith({
        where: { idNote },
      });
    });
  });

  describe('deleteNoteById', () => {
    it('should delete a note by idNote', async () => {
      const idNote = 'exampleIdNote';

      NoteModelMock.destroy.mockResolvedValue(1);

      const result = await noteService.deleteNoteById(idNote);

      expect(result).toEqual(true);
      expect(NoteModelMock.destroy).toHaveBeenCalledWith({
        where: { idNote },
      });
    });
  });

  describe('updateNote', () => {
    it('should update a note and return the updated note', async () => {
      const idNote = 'exampleIdNote';
      const commentary = 'Updated commentary';
      const updatedNoteData = {
        // provide necessary data for the updated note
      };

      NoteModelMock.update.mockResolvedValue([1]);
      NoteModelMock.findOne.mockResolvedValue(updatedNoteData);

      const result = await noteService.updateNote(commentary, idNote);

      expect(result).toEqual(updatedNoteData);
      expect(NoteModelMock.update).toHaveBeenCalledWith(
        { commentary },
        { where: { idNote } },
      );
      expect(NoteModelMock.findOne).toHaveBeenCalledWith({
        where: { idNote },
      });
    });

    it('should return false if update fails', async () => {
      const idNote = 'exampleIdNote';
      const commentary = 'Updated commentary';

      NoteModelMock.update.mockResolvedValue([0]);

      const result = await noteService.updateNote(commentary, idNote);

      expect(result).toEqual(false);
      expect(NoteModelMock.update).toHaveBeenCalledWith(
        { commentary },
        { where: { idNote } },
      );
    });
  });
});
