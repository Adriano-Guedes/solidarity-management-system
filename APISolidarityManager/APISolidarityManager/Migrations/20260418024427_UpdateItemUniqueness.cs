using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APISolidarityManager.Migrations
{
    /// <inheritdoc />
    public partial class UpdateItemUniqueness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_items_category_id_name",
                table: "items");

            migrationBuilder.AddColumn<decimal>(
                name: "package_quantity",
                table: "items",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_items_category_id_name_package_quantity_unit_of_measure",
                table: "items",
                columns: new[] { "category_id", "name", "package_quantity", "unit_of_measure" },
                unique: true,
                filter: "[unit_of_measure] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_items_category_id_name_package_quantity_unit_of_measure",
                table: "items");

            migrationBuilder.DropColumn(
                name: "package_quantity",
                table: "items");

            migrationBuilder.CreateIndex(
                name: "IX_items_category_id_name",
                table: "items",
                columns: new[] { "category_id", "name" },
                unique: true);
        }
    }
}
