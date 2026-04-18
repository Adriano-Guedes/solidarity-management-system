using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APISolidarityManager.Migrations
{
    /// <inheritdoc />
    public partial class NewAndUpdatedEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "item_template_id",
                table: "items",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "item_templates",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    category_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    need_group = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    is_perishable = table.Column<bool>(type: "bit", nullable: false),
                    requires_refrigeration = table.Column<bool>(type: "bit", nullable: false),
                    suitable_for_auto_suggestion = table.Column<bool>(type: "bit", nullable: false),
                    requires_manual_analysis = table.Column<bool>(type: "bit", nullable: false),
                    default_unit_of_measure = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    reference_quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    active = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_item_templates", x => x.id);
                    table.ForeignKey(
                        name: "FK_item_templates_items_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "items_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_items_item_template_id",
                table: "items",
                column: "item_template_id");

            migrationBuilder.CreateIndex(
                name: "IX_item_templates_category_id_name",
                table: "item_templates",
                columns: new[] { "category_id", "name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_items_item_templates_item_template_id",
                table: "items",
                column: "item_template_id",
                principalTable: "item_templates",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_items_item_templates_item_template_id",
                table: "items");

            migrationBuilder.DropTable(
                name: "item_templates");

            migrationBuilder.DropIndex(
                name: "IX_items_item_template_id",
                table: "items");

            migrationBuilder.DropColumn(
                name: "item_template_id",
                table: "items");
        }
    }
}
