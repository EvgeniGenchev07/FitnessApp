using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DBContexts.Migrations
{
    /// <inheritdoc />
    public partial class update_15 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Foods_Users_UserId",
                table: "Foods");

            migrationBuilder.DropIndex(
                name: "IX_Foods_UserId",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "WeightGoal",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Foods");

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "Meals",
                type: "REAL",
                precision: 2,
                scale: 5,
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "WeightGoal",
                table: "Meals",
                type: "REAL",
                precision: 2,
                scale: 5,
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "WeightGoal",
                table: "Meals");

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "Users",
                type: "REAL",
                precision: 2,
                scale: 5,
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "WeightGoal",
                table: "Users",
                type: "REAL",
                precision: 2,
                scale: 5,
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Foods",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Foods_UserId",
                table: "Foods",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Foods_Users_UserId",
                table: "Foods",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
