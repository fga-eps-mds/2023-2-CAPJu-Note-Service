import { NoteController } from '../../src/controllers/note.js';
import services from '../../src/services/_index.js';

jest.mock('../../src/services/_index.js');

describe('NoteController', () => {
  let noteController;
  let reqMock;
  let resMock;

  beforeEach(() => {
    noteController = new NoteController();
    reqMock = {
      params: {},
      body: {},
    };
    resMock = {
      status: jest.fn(() => resMock),
      json: jest.fn(),
    };
  });

  describe('index', () => {
    it('should get notes by idProcess', async () => {
      const idProcess = 'exampleIdProcess';
      reqMock.params.idProcess = idProcess;

      services.noteService.findAllByIdProcess.mockResolvedValue([]);

      await noteController.index(reqMock, resMock);

      expect(services.noteService.findAllByIdProcess).toHaveBeenCalledWith(
        idProcess,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith([]);
    });

    it('should handle errors during index', async () => {
      const errorMessage = 'Error: fetching notes';
      services.noteService.findAllByIdProcess.mockRejectedValue(
        new Error(errorMessage),
      );

      await noteController.index(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Erro ao buscar observação: ${errorMessage}`,
      });
    });
  });

  describe('newNote', () => {
    it('should create a new note and log the process audit', async () => {
      const newNoteData = {
        commentary: 'Test Comment',
        idProcess: 'exampleIdProcess',
        idStageA: 'exampleIdStageA',
        idStageB: 'exampleIdStageB',
      };
      reqMock.body = newNoteData;

      services.noteService.createNote.mockResolvedValue(newNoteData);
      services.processAudService.create.mockResolvedValue(null);

      await noteController.newNote(reqMock, resMock);

      expect(services.noteService.createNote).toHaveBeenCalledWith(newNoteData);
      expect(services.processAudService.create).toHaveBeenCalledWith(
        newNoteData.idProcess,
        null,
        'NOTE_CHANGE',
        reqMock,
        `Comentário ${newNoteData.commentary} adicionado`,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(newNoteData);
    });

    it('should handle errors during newNote', async () => {
      const errorMessage = 'Error: creating new note';
      services.noteService.createNote.mockRejectedValue(
        new Error(errorMessage),
      );

      await noteController.newNote(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Erro ao criar observação: ${errorMessage}`,
      });
    });
  });

  describe('delete', () => {
    it('should delete a note and log the process audit', async () => {
      const idNote = 'exampleIdNote';
      reqMock.params.idNote = idNote;

      const mockNote = {
        idNote,
        idProcess: 'exampleIdProcess',
        commentary: 'Test Comment',
      };

      services.noteService.findOneById.mockResolvedValue(mockNote);
      services.noteService.deleteNoteById.mockResolvedValue(null);
      services.processAudService.create.mockResolvedValue(null);

      await noteController.delete(reqMock, resMock);

      expect(services.noteService.findOneById).toHaveBeenCalledWith(idNote);
      expect(services.noteService.deleteNoteById).toHaveBeenCalledWith(idNote);
      expect(services.processAudService.create).toHaveBeenCalledWith(
        mockNote.idProcess,
        null,
        'NOTE_CHANGE',
        reqMock,
        `Comentário ${mockNote.commentary} removido`,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Observação deletada com sucesso.',
      });
    });

    it('should handle errors during delete', async () => {
      const errorMessage = 'Error: deleting note';
      services.noteService.findOneById.mockRejectedValue(
        new Error(errorMessage),
      );

      await noteController.delete(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Erro ao deletar observação: ${errorMessage}`,
      });
    });

    it('should return a 400 status if the note does not exist', async () => {
      const idNote = 'nonExistentIdNote';
      reqMock.params.idNote = idNote;

      services.noteService.findOneById.mockResolvedValue(null);

      await noteController.delete(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        error: `idNote ${idNote} não existe!`,
      });
    });
  });

  describe('update', () => {
    it('should update a note and log the process audit', async () => {
      const idNote = 'exampleIdNote';
      reqMock.params.idNote = idNote;
      reqMock.body.commentary = 'Updated Comment';

      const originalNote = {
        idNote,
        idProcess: 'exampleIdProcess',
        commentary: 'Test Comment',
      };

      const updatedNote = {
        ...originalNote,
        commentary: reqMock.body.commentary,
      };

      services.noteService.findOneById.mockResolvedValue(originalNote);
      services.noteService.updateNote.mockResolvedValue(updatedNote);
      services.processAudService.create.mockResolvedValue(null);

      await noteController.update(reqMock, resMock);

      expect(services.noteService.findOneById).toHaveBeenCalledWith(idNote);
      expect(services.noteService.updateNote).toHaveBeenCalledWith(
        reqMock.body.commentary,
        idNote,
      );
      expect(services.processAudService.create).toHaveBeenCalledWith(
        originalNote.idProcess,
        null,
        'NOTE_CHANGE',
        reqMock,
        `Comentário ${originalNote.commentary} alterado para ${reqMock.body.commentary}`,
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        message: 'Observação atualizada com sucesso.',
      });
    });

    it('should return a 400 status if the note does not exist', async () => {
      const idNote = 'nonExistentIdNote';
      reqMock.params.idNote = idNote;

      services.noteService.findOneById.mockResolvedValue(null);

      await noteController.update(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        error: `idNote ${idNote} não existe!`,
      });
    });

    it('should handle errors during update', async () => {
      const errorMessage = 'Error: updating note';
      services.noteService.findOneById.mockRejectedValue(
        new Error(errorMessage),
      );

      await noteController.update(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        message: `Erro ao atualizar observação: ${errorMessage}`,
      });
    });

    it('should return a 400 status if the update fails', async () => {
      const idNote = 'exampleIdNote';
      reqMock.params.idNote = idNote;
      reqMock.body.commentary = 'Updated Comment';

      const originalNote = {
        idNote,
        idProcess: 'exampleIdProcess',
        commentary: 'Test Comment',
      };

      services.noteService.findOneById.mockResolvedValue(originalNote);
      services.noteService.updateNote.mockResolvedValue(false);

      await noteController.update(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        error: `idNote ${idNote} não existe!`,
      });
    });
  });
});
