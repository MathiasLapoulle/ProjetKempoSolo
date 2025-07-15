import { Migration } from '@mikro-orm/migrations';

export class Migration20250714151956 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`first_name\` varchar(255) not null, \`last_name\` varchar(255) not null, \`role\` varchar(255) not null default 'user', \`birth_date\` datetime null, \`club\` varchar(255) null, \`city\` varchar(255) null, \`grade\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') null, \`reset_password_token\` varchar(255) null, \`reset_password_expires\` datetime null, \`created_at\` datetime not null default now(), \`updated_at\` datetime not null default now()) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);

    this.addSql(`drop table if exists \`user_model\`;`);

    this.addSql(`drop table if exists \`user_role\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`tournament\` add \`rank\` varchar(255) not null, add \`gender\` varchar(255) not null, add \`system\` varchar(255) not null;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop index \`tournament_competitor_category_category_id_index\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop column \`category_id\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table \`user_model\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`first_name\` varchar(255) null, \`last_name\` varchar(255) null, \`role\` varchar(255) not null default 'user', \`birth_date\` datetime null, \`club\` varchar(255) null, \`city\` varchar(255) null, \`reset_password_token\` varchar(255) null, \`reset_password_expires\` datetime null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user_model\` add unique \`user_model_email_unique\`(\`email\`);`);

    this.addSql(`create table \`user_role\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`drop table if exists \`user\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);
    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`tournament\` drop column \`rank\`, drop column \`gender\`, drop column \`system\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` add \`category_id\` varchar(36) null;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade on delete no action;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade on delete no action;`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_category_id_index\`(\`category_id\`);`);
  }

}
