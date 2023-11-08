import NoteService from '../../src/services/note';

const NoteModelMock = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('NoteService', () => {
  let reqMock;
  let resMock;
  let noteService;

  beforeEach(() => {
    reqMock = {
      body: {},
      params: {},
    };
    resMock = {
      json: jest.fn(),
      status: jest.fn(() => resMock),
    };
    noteService = new NoteService(NoteModelMock);
  });

  describe('Basics', () => {
    it('Criar uma nota', async () => {
      const newNote = {
        idNote: 1,
        commentary: 'Atrasada',
        record: '24200752720234015258',
        idStageA: 1,
        idStageB: 2,
      };
      NoteModelMock.create.mockResolvedValue({ idNote: 3, ...newNote });

      const result = await noteService.createNote(newNote);

      expect(result).toEqual({ idNote: 3, ...newNote });
      expect(NoteModelMock.create).toHaveBeenCalledWith(newNote);
    });

    it('Achar todas notas de um registro', async () => {
      const notes = [
        {
          idNote: 1,
          commentary: 'Atrasada',
          record: '24200752720234015258',
          idStageA: 1,
          idStageB: 2,
        },
        {
          idNote: 2,
          commentary: 'Tudo Certo',
          record: '24200752720234015258',
          idStageA: 2,
          idStageB: 3,
        },
        {
          idNote: 3,
          commentary: 'Nunca realizada',
          record: '24200752720234015258',
          idStageA: 3,
          idStageB: 4,
        },
      ];

      const record = '24200752720234015258';

      NoteModelMock.findAll.mockResolvedValue(notes);

      const result = await noteService.findAllByRecord(record);

      expect(result).toEqual(notes);
      expect(NoteModelMock.findAll).toHaveBeenCalledWith({
        where: { record },
      });
    });

    it('Achar uma nota pelo ID', async () => {
      const note = {
        idNote: 2,
        commentary: 'Atrasada',
        record: '24200752720234015258',
        idStageA: 1,
        idStageB: 2,
      };

      const idNote = 2;

      NoteModelMock.findOne.mockResolvedValue(note);

      const result = await noteService.findOneById(idNote);

      expect(result).toEqual(note);
      expect(NoteModelMock.findOne).toHaveBeenCalledWith({
        where: { idNote },
      });
    });

    it('Deletar uma nota pelo ID', async () => {
      const response = 1;

      const idNote = 2;

      NoteModelMock.destroy.mockResolvedValue(response);

      const result = await noteService.deleteNoteById(idNote);

      expect(result).toEqual(response);
      expect(NoteModelMock.destroy).toHaveBeenCalledWith({
        where: { idNote },
      });
    });

    it('Atualizar uma nota - Sucesso', async () => {
      const update = [1]; // O Sequalize retorna o número de objetos encontrados

      const note = {
        idNote: 1,
        commentary: 'Atrasada',
        record: '24200752720234015258',
        idStageA: 1,
        idStageB: 2,
      };

      const idNote = 2;
      const commentary = 'Some commentary';

      NoteModelMock.update.mockResolvedValue(update);
      NoteModelMock.findOne.mockResolvedValue(note);

      const result = await noteService.updateNote(commentary, idNote);

      expect(result).toEqual(note);
      expect(NoteModelMock.update).toHaveBeenCalledWith(
        { commentary },
        { where: { idNote } },
      );
    });

    it('Atualizar uma nota - Falha', async () => {
      const update = [0]; // O Sequalize retorna o número de objetos encontrados
      const updateResponse = false;
      const idNote = 2;
      const commentary = 'Some commentary';

      NoteModelMock.update.mockResolvedValue(update);

      const result = await noteService.updateNote(commentary, idNote);

      expect(result).toEqual(updateResponse);
      expect(NoteModelMock.update).toHaveBeenCalledWith(
        { commentary },
        { where: { idNote } },
      );
    });
  });
});
