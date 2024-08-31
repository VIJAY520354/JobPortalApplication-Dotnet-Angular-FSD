using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalApplication.Migrations
{
    /// <inheritdoc />
    public partial class appliedstatusfieldadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppliedStatus",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppliedStatus",
                table: "Jobs");
        }
    }
}
