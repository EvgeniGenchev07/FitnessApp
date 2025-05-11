using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DBContexts.Migrations
{
    /// <inheritdoc />
    public partial class Update_v12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoMimeType",
                table: "Posts",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoMimeType",
                table: "Posts");
        }
    }
}
