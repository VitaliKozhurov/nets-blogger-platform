import { DataSource } from 'typeorm';

// TODO add it for typeorm entities
// export const clearDatabase = async (dataSource: DataSource) => {
//   const entities = dataSource.entityMetadatas;

//   console.log('dataSource: ', dataSource);
//   console.log('entities: ', entities);

//   for (const entity of entities) {
//     const repository = dataSource.getRepository(entity.name);

//     await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
//   }
// };

export const clearDatabase = async (dataSource: DataSource) => {
  const tables: { table_name: string }[] = await dataSource.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
  `);

  if (!tables.length) {
    console.log('No tables found');

    return;
  }

  const tableNames = tables.map(({ table_name }) => `"public"."${table_name}"`).join(', ');

  await dataSource.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
};
