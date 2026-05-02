using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APISolidarityManager.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateWeightToItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "template_weight",
                table: "items",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 1.0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "template_weight",
                table: "items");
        }
    }
}
