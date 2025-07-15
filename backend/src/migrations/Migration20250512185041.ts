import { Migration } from '@mikro-orm/migrations';

export class Migration20250512185041 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop index \`tournament_competitor_category_category_id_index\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop column \`category_id\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` add \`category_id\` varchar(36) null;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_category_id_index\`(\`category_id\`);`);
  }

}
