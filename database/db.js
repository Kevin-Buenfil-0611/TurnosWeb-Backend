import { Sequelize } from "sequelize";

const db = new Sequelize('bd_turnos', 'root', '12345', {
    host: '127.0.0.1',
    dialect: 'mysql',
    define: { timestamps: false }
});

export default db;