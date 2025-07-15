import { Migration } from '@mikro-orm/migrations';

export class Migration20250428180034 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`age_group\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`age_min\` int not null, \`age_max\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`competitor\` (\`id\` varchar(36) not null, \`firstname\` varchar(255) not null, \`lastname\` varchar(255) not null, \`birthday\` datetime not null, \`club\` varchar(255) not null, \`country\` varchar(255) not null, \`weight\` int not null, \`rank\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') not null, \`gender\` enum('H', 'F') not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`tournament\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`city\` varchar(255) not null, \`start_date\` datetime not null, \`end_date\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`weight_category\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`weight_min\` int not null, \`weight_max\` int not null, \`age_group_id\` int unsigned not null, \`gender\` enum('H', 'F') not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`weight_category\` add index \`weight_category_age_group_id_index\`(\`age_group_id\`);`);

    this.addSql(`create table \`category\` (\`id\` varchar(36) not null, \`rank\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') not null, \`gender\` enum('H', 'F') not null, \`weight_category_id\` int unsigned null, \`tournament_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`category\` add index \`category_weight_category_id_index\`(\`weight_category_id\`);`);
    this.addSql(`alter table \`category\` add index \`category_tournament_id_index\`(\`tournament_id\`);`);

    this.addSql(`create table \`tournament_competitor_category\` (\`tournament_id\` varchar(36) not null, \`competitor_id\` varchar(36) not null, \`category_id\` varchar(36) not null, primary key (\`tournament_id\`, \`competitor_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_tournament_id_index\`(\`tournament_id\`);`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_competitor_id_index\`(\`competitor_id\`);`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_category_id_index\`(\`category_id\`);`);

    this.addSql(`alter table \`weight_category\` add constraint \`weight_category_age_group_id_foreign\` foreign key (\`age_group_id\`) references \`age_group\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`category\` add constraint \`category_weight_category_id_foreign\` foreign key (\`weight_category_id\`) references \`weight_category\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`category\` add constraint \`category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`weight_category\` drop foreign key \`weight_category_age_group_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`category\` drop foreign key \`category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`category\` drop foreign key \`category_weight_category_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);

    this.addSql(`drop table if exists \`age_group\`;`);

    this.addSql(`drop table if exists \`competitor\`;`);

    this.addSql(`drop table if exists \`tournament\`;`);

    this.addSql(`drop table if exists \`weight_category\`;`);

    this.addSql(`drop table if exists \`category\`;`);

    this.addSql(`drop table if exists \`tournament_competitor_category\`;`);
  }

}
