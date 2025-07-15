import { Migration } from '@mikro-orm/migrations';

export class Migration20250513000001 extends Migration {

  override async up(): Promise<void> {
    // Création de la table user
    this.addSql(`
      CREATE TABLE IF NOT EXISTS \`user\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`first_name\` varchar(255) NOT NULL,
        \`last_name\` varchar(255) NOT NULL,
        \`role\` varchar(255) NOT NULL DEFAULT 'user',
        \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`email_unique\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
  }

  override async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS `user`;');
  }
}
