using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalApplication.Migrations
{
    /// <inheritdoc />
    public partial class addedexternalcolumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JobType",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ExternalPositions",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobType",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ExternalPositions",
                table: "Jobs");
        }
    }
}
