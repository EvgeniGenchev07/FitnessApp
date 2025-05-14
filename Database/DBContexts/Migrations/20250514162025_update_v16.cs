using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DBContexts.Migrations
{
    /// <inheritdoc />
    public partial class update_v16 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Measurements");

            migrationBuilder.AddColumn<byte>(
                name: "Weight",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Arm = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true),
                    Calf = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true),
                    Chest = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Forearm = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true),
                    Neck = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: true),
                    Waist = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true),
                    Weight = table.Column<double>(type: "REAL", precision: 2, scale: 5, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Measurements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_UserId",
                table: "Measurements",
                column: "UserId");
        }
    }
}
