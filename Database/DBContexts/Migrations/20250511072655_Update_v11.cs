using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DBContexts.Migrations
{
    /// <inheritdoc />
    public partial class Update_v11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_UserID",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Posts",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_UserID",
                table: "Posts",
                newName: "IX_Posts_UserId");

            migrationBuilder.AddColumn<string>(
                name: "PhotoMimeType",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Posts",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_UserId",
                table: "Posts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_UserId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "PhotoMimeType",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Posts",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_UserId",
                table: "Posts",
                newName: "IX_Posts_UserID");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Posts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_UserID",
                table: "Posts",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
