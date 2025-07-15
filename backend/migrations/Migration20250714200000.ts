import { Migration } from '@mikro-orm/migrations';

export class Migration20250714200000 extends Migration {
  async up(): Promise<void> {
    // Make city field nullable in tournament table
    this.addSql('ALTER TABLE `tournament` MODIFY `city` varchar(255) NULL;');
  }

  async down(): Promise<void> {
    // Revert to make city field not nullable
    this.addSql('ALTER TABLE `tournament` MODIFY `city` varchar(255) NOT NULL;');
  }
}
