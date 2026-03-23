using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APISolidarityManager.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_Beneficiaries_BeneficiaryId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_Users_CreatedBy",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Donations_Donors_DonorId",
                table: "Donations");

            migrationBuilder.DropForeignKey(
                name: "FK_Donations_Users_CreatedBy",
                table: "Donations");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "DeliveryItems");

            migrationBuilder.DropTable(
                name: "DonationItems");

            migrationBuilder.DropTable(
                name: "Inventories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                table: "Roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Donors",
                table: "Donors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Donations",
                table: "Donations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Deliveries",
                table: "Deliveries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Beneficiaries",
                table: "Beneficiaries");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "roles");

            migrationBuilder.RenameTable(
                name: "Items",
                newName: "items");

            migrationBuilder.RenameTable(
                name: "Donors",
                newName: "donors");

            migrationBuilder.RenameTable(
                name: "Donations",
                newName: "donations");

            migrationBuilder.RenameTable(
                name: "Deliveries",
                newName: "deliveries");

            migrationBuilder.RenameTable(
                name: "Beneficiaries",
                newName: "beneficiaries");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RoleId",
                table: "users",
                newName: "IX_users_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_Email",
                table: "users",
                newName: "IX_users_Email");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "roles",
                newName: "Description");

            migrationBuilder.RenameIndex(
                name: "IX_Donations_DonorId",
                table: "donations",
                newName: "IX_donations_DonorId");

            migrationBuilder.RenameIndex(
                name: "IX_Donations_CreatedBy",
                table: "donations",
                newName: "IX_donations_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Deliveries_CreatedBy",
                table: "deliveries",
                newName: "IX_deliveries_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Deliveries_BeneficiaryId",
                table: "deliveries",
                newName: "IX_deliveries_BeneficiaryId");

            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "items",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "TotalQuantity",
                table: "items",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_roles",
                table: "roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_items",
                table: "items",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_donors",
                table: "donors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_donations",
                table: "donations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_deliveries",
                table: "deliveries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_beneficiaries",
                table: "beneficiaries",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "inventory_batches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ItemId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ExpirationDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    QuantityAvailable = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inventory_batches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_inventory_batches_items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "delivery_inventory_items",
                columns: table => new
                {
                    DeliveryId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    InventoryBatchId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_delivery_inventory_items", x => new { x.DeliveryId, x.InventoryBatchId });
                    table.ForeignKey(
                        name: "FK_delivery_inventory_items_deliveries_DeliveryId",
                        column: x => x.DeliveryId,
                        principalTable: "deliveries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_delivery_inventory_items_inventory_batches_InventoryBatchId",
                        column: x => x.InventoryBatchId,
                        principalTable: "inventory_batches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "donation_inventory_items",
                columns: table => new
                {
                    DonationId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    InventoryBatchId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_donation_inventory_items", x => new { x.DonationId, x.InventoryBatchId });
                    table.ForeignKey(
                        name: "FK_donation_inventory_items_donations_DonationId",
                        column: x => x.DonationId,
                        principalTable: "donations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_donation_inventory_items_inventory_batches_InventoryBatchId",
                        column: x => x.InventoryBatchId,
                        principalTable: "inventory_batches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_roles_Name",
                table: "roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_items_Name",
                table: "items",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_donors_DocumentNumber",
                table: "donors",
                column: "DocumentNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_beneficiaries_DocumentNumber",
                table: "beneficiaries",
                column: "DocumentNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_delivery_inventory_items_InventoryBatchId",
                table: "delivery_inventory_items",
                column: "InventoryBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_donation_inventory_items_InventoryBatchId",
                table: "donation_inventory_items",
                column: "InventoryBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_inventory_batches_ItemId",
                table: "inventory_batches",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_deliveries_beneficiaries_BeneficiaryId",
                table: "deliveries",
                column: "BeneficiaryId",
                principalTable: "beneficiaries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_deliveries_users_CreatedBy",
                table: "deliveries",
                column: "CreatedBy",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_donations_donors_DonorId",
                table: "donations",
                column: "DonorId",
                principalTable: "donors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_donations_users_CreatedBy",
                table: "donations",
                column: "CreatedBy",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_users_roles_RoleId",
                table: "users",
                column: "RoleId",
                principalTable: "roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_deliveries_beneficiaries_BeneficiaryId",
                table: "deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_deliveries_users_CreatedBy",
                table: "deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_donations_donors_DonorId",
                table: "donations");

            migrationBuilder.DropForeignKey(
                name: "FK_donations_users_CreatedBy",
                table: "donations");

            migrationBuilder.DropForeignKey(
                name: "FK_users_roles_RoleId",
                table: "users");

            migrationBuilder.DropTable(
                name: "delivery_inventory_items");

            migrationBuilder.DropTable(
                name: "donation_inventory_items");

            migrationBuilder.DropTable(
                name: "inventory_batches");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_roles",
                table: "roles");

            migrationBuilder.DropIndex(
                name: "IX_roles_Name",
                table: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_items",
                table: "items");

            migrationBuilder.DropIndex(
                name: "IX_items_Name",
                table: "items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_donors",
                table: "donors");

            migrationBuilder.DropIndex(
                name: "IX_donors_DocumentNumber",
                table: "donors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_donations",
                table: "donations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_deliveries",
                table: "deliveries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_beneficiaries",
                table: "beneficiaries");

            migrationBuilder.DropIndex(
                name: "IX_beneficiaries_DocumentNumber",
                table: "beneficiaries");

            migrationBuilder.DropColumn(
                name: "Brand",
                table: "items");

            migrationBuilder.DropColumn(
                name: "TotalQuantity",
                table: "items");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "roles",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "items",
                newName: "Items");

            migrationBuilder.RenameTable(
                name: "donors",
                newName: "Donors");

            migrationBuilder.RenameTable(
                name: "donations",
                newName: "Donations");

            migrationBuilder.RenameTable(
                name: "deliveries",
                newName: "Deliveries");

            migrationBuilder.RenameTable(
                name: "beneficiaries",
                newName: "Beneficiaries");

            migrationBuilder.RenameIndex(
                name: "IX_users_RoleId",
                table: "Users",
                newName: "IX_Users_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_users_Email",
                table: "Users",
                newName: "IX_Users_Email");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Roles",
                newName: "Notes");

            migrationBuilder.RenameIndex(
                name: "IX_donations_DonorId",
                table: "Donations",
                newName: "IX_Donations_DonorId");

            migrationBuilder.RenameIndex(
                name: "IX_donations_CreatedBy",
                table: "Donations",
                newName: "IX_Donations_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_deliveries_CreatedBy",
                table: "Deliveries",
                newName: "IX_Deliveries_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_deliveries_BeneficiaryId",
                table: "Deliveries",
                newName: "IX_Deliveries_BeneficiaryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                table: "Roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Donors",
                table: "Donors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Donations",
                table: "Donations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Deliveries",
                table: "Deliveries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Beneficiaries",
                table: "Beneficiaries",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DeliveryItems",
                columns: table => new
                {
                    DeliveryId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ItemId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryItems", x => new { x.DeliveryId, x.ItemId });
                    table.ForeignKey(
                        name: "FK_DeliveryItems_Deliveries_DeliveryId",
                        column: x => x.DeliveryId,
                        principalTable: "Deliveries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeliveryItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DonationItems",
                columns: table => new
                {
                    DonationId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ItemId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationItems", x => new { x.DonationId, x.ItemId });
                    table.ForeignKey(
                        name: "FK_DonationItems_Donations_DonationId",
                        column: x => x.DonationId,
                        principalTable: "Donations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DonationItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Inventories",
                columns: table => new
                {
                    ItemId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    QuantityAvailable = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventories", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Inventories_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryItems_ItemId",
                table: "DeliveryItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationItems_ItemId",
                table: "DonationItems",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_Beneficiaries_BeneficiaryId",
                table: "Deliveries",
                column: "BeneficiaryId",
                principalTable: "Beneficiaries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_Users_CreatedBy",
                table: "Deliveries",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_Donors_DonorId",
                table: "Donations",
                column: "DonorId",
                principalTable: "Donors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Donations_Users_CreatedBy",
                table: "Donations",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
