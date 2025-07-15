import { Migration } from '@mikro-orm/migrations';

export class Migration20250513110000 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user` add `reset_password_token` varchar(255) null;');
    this.addSql('alter table `user` add `reset_password_expires` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop column `reset_password_token`;');
    this.addSql('alter table `user` drop column `reset_password_expires`;');
  }
}
