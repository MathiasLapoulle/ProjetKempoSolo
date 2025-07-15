import { Migration } from '@mikro-orm/migrations';

export class Migration20250513001000 extends Migration {

  override async up(): Promise<void> {
    // Ajout des colonnes manquantes dans la table user
    this.addSql(`
      ALTER TABLE \`user\` 
      ADD COLUMN \`birth_date\` DATETIME NULL,
      ADD COLUMN \`club\` VARCHAR(255) NULL,
      ADD COLUMN \`city\` VARCHAR(255) NULL;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE \`user\`
      DROP COLUMN \`birth_date\`,
      DROP COLUMN \`club\`,
      DROP COLUMN \`city\`;
    `);
  }
}
