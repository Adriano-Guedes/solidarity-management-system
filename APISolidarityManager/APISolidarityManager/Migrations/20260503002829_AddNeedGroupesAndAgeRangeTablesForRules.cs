using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APISolidarityManager.Migrations
{
    /// <inheritdoc />
    public partial class AddNeedGroupesAndAgeRangeTablesForRules : Migration
    {
        private readonly Guid _baseAlimentarId = new Guid("38917865-c89b-449e-b9b0-95b8d23ca9e2");
        private readonly Guid _leguminosaId = new Guid("a7d745e1-953e-468a-9289-408a6a666991");
        private readonly Guid _higienePessoalId = new Guid("c3a8867a-18b0-4663-8f0a-1153a5c60205");
        private readonly Guid _limpezaBasicaId = new Guid("e8b5d3a5-1c7b-4d9a-8e2b-7a5c6d3e4f1a");

        private readonly Guid _bebesId = new Guid("f2a5b6c7-d8e9-4a0b-b1c2-d3e4f5a6b7c8");
        private readonly Guid _criancasId = new Guid("a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d");
        private readonly Guid _adultosId = new Guid("b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e");
        private readonly Guid _idososId = new Guid("c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f");

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Criar Tabelas
            migrationBuilder.CreateTable(
                name: "age_ranges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    min_age = table.Column<int>(type: "int", nullable: false),
                    max_age = table.Column<int>(type: "int", nullable: false),
                    active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_age_ranges", x => x.id); });

            migrationBuilder.CreateTable(
                name: "need_groups",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_need_groups", x => x.id); });

            migrationBuilder.CreateTable(
                name: "need_rules",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    age_range_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    need_group_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    value = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_need_rules", x => x.id);
                    table.ForeignKey(name: "FK_need_rules_age_ranges_age_range_id", column: x => x.age_range_id, principalTable: "age_ranges", principalColumn: "id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(name: "FK_need_rules_need_groups_need_group_id", column: x => x.need_group_id, principalTable: "need_groups", principalColumn: "id", onDelete: ReferentialAction.Cascade);
                });

            // 2. Inserir Dados Base (NeedGroups)
            migrationBuilder.InsertData("need_groups", new[] { "id", "name", "active", "created_at" }, new object[,] {
                { _baseAlimentarId, "Base Alimentar", true, DateTime.UtcNow },
                { _leguminosaId, "Leguminosa", true, DateTime.UtcNow },
                { _higienePessoalId, "Higiene Pessoal", true, DateTime.UtcNow },
                { _limpezaBasicaId, "Limpeza Básica", true, DateTime.UtcNow }
            });

            // 3. Inserir Dados Base (AgeRanges)
            migrationBuilder.InsertData("age_ranges", new[] { "id", "name", "min_age", "max_age", "active", "created_at" }, new object[,] {
                { _bebesId, "Bebês", 0, 2, true, DateTime.UtcNow },
                { _criancasId, "Crianças", 3, 12, true, DateTime.UtcNow },
                { _adultosId, "Adultos", 13, 59, true, DateTime.UtcNow },
                { _idososId, "Idosos", 60, 150, true, DateTime.UtcNow }
            });

            // 4. Inserir Regras Atuais
            migrationBuilder.InsertData("need_rules", new[] { "id", "age_range_id", "need_group_id", "value", "created_at" }, new object[,] {
                // Bebês
                { Guid.NewGuid(), _bebesId, _baseAlimentarId, 0m, DateTime.UtcNow },
                { Guid.NewGuid(), _bebesId, _leguminosaId, 0m, DateTime.UtcNow },
                { Guid.NewGuid(), _bebesId, _higienePessoalId, 1.5m, DateTime.UtcNow },
                { Guid.NewGuid(), _bebesId, _limpezaBasicaId, 0.5m, DateTime.UtcNow },
                // Crianças
                { Guid.NewGuid(), _criancasId, _baseAlimentarId, 0.75m, DateTime.UtcNow },
                { Guid.NewGuid(), _criancasId, _leguminosaId, 0.75m, DateTime.UtcNow },
                { Guid.NewGuid(), _criancasId, _higienePessoalId, 1.0m, DateTime.UtcNow },
                { Guid.NewGuid(), _criancasId, _limpezaBasicaId, 0.5m, DateTime.UtcNow },
                // Adultos
                { Guid.NewGuid(), _adultosId, _baseAlimentarId, 1.0m, DateTime.UtcNow },
                { Guid.NewGuid(), _adultosId, _leguminosaId, 1.0m, DateTime.UtcNow },
                { Guid.NewGuid(), _adultosId, _higienePessoalId, 1.0m, DateTime.UtcNow },
                { Guid.NewGuid(), _adultosId, _limpezaBasicaId, 0.5m, DateTime.UtcNow },
                // Idosos
                { Guid.NewGuid(), _idososId, _baseAlimentarId, 0.8m, DateTime.UtcNow },
                { Guid.NewGuid(), _idososId, _leguminosaId, 0.8m, DateTime.UtcNow },
                { Guid.NewGuid(), _idososId, _higienePessoalId, 1.0m, DateTime.UtcNow },
                { Guid.NewGuid(), _idososId, _limpezaBasicaId, 0.5m, DateTime.UtcNow }
            });

            // 5. Migrar ItemTemplates (Adicionar FK e mapear strings antigas)
            migrationBuilder.AddColumn<Guid>(
                name: "need_group_id",
                table: "item_templates",
                type: "uniqueidentifier",
                nullable: true); // Temporariamente nullable para migração

            // Mapeia os nomes antigos para os novos IDs
            migrationBuilder.Sql($"UPDATE item_templates SET need_group_id = '{_baseAlimentarId}' WHERE need_group = 'BaseAlimentar'");
            migrationBuilder.Sql($"UPDATE item_templates SET need_group_id = '{_leguminosaId}' WHERE need_group = 'Leguminosa'");
            migrationBuilder.Sql($"UPDATE item_templates SET need_group_id = '{_higienePessoalId}' WHERE need_group = 'HigienePessoal'");
            migrationBuilder.Sql($"UPDATE item_templates SET need_group_id = '{_limpezaBasicaId}' WHERE need_group = 'LimpezaBasica'");

            // Se sobrar algum sem mapeamento, coloca na Base Alimentar por padrão
            migrationBuilder.Sql($"UPDATE item_templates SET need_group_id = '{_baseAlimentarId}' WHERE need_group_id IS NULL");

            migrationBuilder.AlterColumn<Guid>(
                name: "need_group_id",
                table: "item_templates",
                nullable: false);

            migrationBuilder.DropColumn(
                name: "need_group",
                table: "item_templates");

            // Índices e FK Final
            migrationBuilder.CreateIndex(name: "IX_item_templates_need_group_id", table: "item_templates", column: "need_group_id");
            migrationBuilder.CreateIndex(name: "IX_need_groups_name", table: "need_groups", column: "name", unique: true);
            migrationBuilder.CreateIndex(name: "IX_need_rules_age_range_id", table: "need_rules", column: "age_range_id");
            migrationBuilder.CreateIndex(name: "IX_need_rules_need_group_id", table: "need_rules", column: "need_group_id");

            migrationBuilder.AddForeignKey(
                name: "FK_item_templates_need_groups_need_group_id",
                table: "item_templates",
                column: "need_group_id",
                principalTable: "need_groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_item_templates_need_groups_need_group_id", table: "item_templates");
            migrationBuilder.DropTable(name: "need_rules");
            migrationBuilder.DropTable(name: "age_ranges");
            migrationBuilder.DropTable(name: "need_groups");
            migrationBuilder.DropIndex(name: "IX_item_templates_need_group_id", table: "item_templates");
            migrationBuilder.DropColumn(name: "need_group_id", table: "item_templates");
            migrationBuilder.AddColumn<string>(name: "need_group", table: "item_templates", type: "nvarchar(100)", maxLength: 100, nullable: false, defaultValue: "");
        }
    }
}
