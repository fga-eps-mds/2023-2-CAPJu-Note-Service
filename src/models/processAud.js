import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelizeConfig from '../config/sequelize.js';

class ProcessAudModel extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        processRecord: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        idProcess: {
          type: DataTypes.INTEGER,
          references: {
            model: 'process',
            key: 'idProcess',
          },
          allowNull: false,
          onDelete: 'RESTRICT',
        },
        operation: {
          type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'NOTE_CHANGE'),
          allowNull: false,
        },
        changedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        changedBy: {
          type: DataTypes.STRING(11),
          references: {
            model: 'user',
            key: 'cpf',
          },
          allowNull: false,
        },
        oldValues: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        newValues: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        remarks: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'processAud',
        timestamps: false,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Process, {
      foreignKey: 'idProcess',
      as: 'relatedProcess',
    });
    this.belongsTo(models.User, { foreignKey: 'changedBy', as: 'userInfo' });
  }
}

ProcessAudModel.init(sequelizeConfig, Sequelize.DataTypes);

export default ProcessAudModel;
