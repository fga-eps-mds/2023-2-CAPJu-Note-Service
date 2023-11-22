import ProcessAudService from './processAudService.js';
import models from '../models/_index.js';

class ProcessService {
  constructor(ProcessModel) {
    this.process = ProcessModel;
    this.processAud = new ProcessAudService(models.ProcessAud);
  }

  async getProcessRecordById(idProcess) {
    return (await this.getProcessById(idProcess, ['record']))?.record;
  }

  async getProcessById(idProcess, attributes) {
    return await this.process.findOne({
      where: { idProcess },
      attributes: attributes?.length ? attributes : undefined,
      raw: true,
    });
  }
}

export default ProcessService;
