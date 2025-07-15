const { Migration } = require('@mikro-orm/migrations');

class Migration20250714200000 extends Migration {
  async up() {
    // Make city field nullable in tournament table
    this.addSql('ALTER TABLE `tournament` MODIFY `city` varchar(255) NULL;');
  }

  async down() {
    // Revert to make city field not nullable
    this.addSql('ALTER TABLE `tournament` MODIFY `city` varchar(255) NOT NULL;');
  }
}

module.exports = { Migration20250714200000 };
