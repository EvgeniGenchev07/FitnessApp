using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DBContexts.Migrations
{
    /// <inheritdoc />
    public partial class Update_v6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sets_WorkoutExercises_WorkoutExerciseId",
                table: "Sets");

            migrationBuilder.DropTable(
                name: "WorkoutExercises");

            migrationBuilder.DropColumn(
                name: "MuscleGroups",
                table: "Exercises");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Workouts",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "WorkoutExerciseId",
                table: "Sets",
                newName: "ExerciseId");

            migrationBuilder.RenameIndex(
                name: "IX_Sets_WorkoutExerciseId",
                table: "Sets",
                newName: "IX_Sets_ExerciseId");

            migrationBuilder.AddColumn<int>(
                name: "RestTime",
                table: "Sets",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EstimatedTime",
                table: "Exercises",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WorkoutId",
                table: "Exercises",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_WorkoutId",
                table: "Exercises",
                column: "WorkoutId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_Workouts_WorkoutId",
                table: "Exercises",
                column: "WorkoutId",
                principalTable: "Workouts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sets_Exercises_ExerciseId",
                table: "Sets",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_Workouts_WorkoutId",
                table: "Exercises");

            migrationBuilder.DropForeignKey(
                name: "FK_Sets_Exercises_ExerciseId",
                table: "Sets");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_WorkoutId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "RestTime",
                table: "Sets");

            migrationBuilder.DropColumn(
                name: "EstimatedTime",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "WorkoutId",
                table: "Exercises");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Workouts",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "ExerciseId",
                table: "Sets",
                newName: "WorkoutExerciseId");

            migrationBuilder.RenameIndex(
                name: "IX_Sets_ExerciseId",
                table: "Sets",
                newName: "IX_Sets_WorkoutExerciseId");

            migrationBuilder.AddColumn<string>(
                name: "MuscleGroups",
                table: "Exercises",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "WorkoutExercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ExerciseId = table.Column<int>(type: "INTEGER", nullable: false),
                    WorkoutId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutExercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkoutExercises_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WorkoutExercises_Workouts_WorkoutId",
                        column: x => x.WorkoutId,
                        principalTable: "Workouts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutExercises_ExerciseId",
                table: "WorkoutExercises",
                column: "ExerciseId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutExercises_WorkoutId",
                table: "WorkoutExercises",
                column: "WorkoutId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sets_WorkoutExercises_WorkoutExerciseId",
                table: "Sets",
                column: "WorkoutExerciseId",
                principalTable: "WorkoutExercises",
                principalColumn: "Id");
        }
    }
}
