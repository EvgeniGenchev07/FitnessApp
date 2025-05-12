using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DBContexts.Migrations
{
    /// <inheritdoc />
    public partial class update_v14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meals_Foods_FoodId",
                table: "Meals");

            migrationBuilder.DropIndex(
                name: "IX_Meals_FoodId",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "FoodId",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Meals");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Foods",
                type: "TEXT",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 30);

            migrationBuilder.AddColumn<int>(
                name: "MealId",
                table: "Foods",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Foods",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Foods_MealId",
                table: "Foods",
                column: "MealId");

            migrationBuilder.AddForeignKey(
                name: "FK_Foods_Meals_MealId",
                table: "Foods",
                column: "MealId",
                principalTable: "Meals",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Foods_Meals_MealId",
                table: "Foods");

            migrationBuilder.DropIndex(
                name: "IX_Foods_MealId",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "MealId",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Foods");

            migrationBuilder.AddColumn<int>(
                name: "FoodId",
                table: "Meals",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<byte>(
                name: "Type",
                table: "Meals",
                type: "INTEGER",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<ushort>(
                name: "Weight",
                table: "Meals",
                type: "INTEGER",
                nullable: false,
                defaultValue: (ushort)0);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Foods",
                type: "TEXT",
                maxLength: 30,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Meals_FoodId",
                table: "Meals",
                column: "FoodId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Meals_Foods_FoodId",
                table: "Meals",
                column: "FoodId",
                principalTable: "Foods",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
