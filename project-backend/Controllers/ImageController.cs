using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using project_backend.DTOs.Image;

namespace ImageUploadApi.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class ImageController : ControllerBase
  {
    private readonly DriveService _driveService;

    public ImageController()
    {
      _driveService = GetDriveService();
    }

    [HttpPost("upload")]
    public async Task<ActionResult<Upload>> UploadImage([FromBody] string Base64Image)
    {
      try
      {
        byte[] imageBytes = Convert.FromBase64String(Base64Image);
        string fileName = $"{Guid.NewGuid()}.jpg";

        var fileMetadata = new Google.Apis.Drive.v3.Data.File()
        {
          Name = fileName,
          MimeType = "image/jpeg"
        };

        FilesResource.CreateMediaUpload request;
        using (var stream = new MemoryStream(imageBytes))
        {
          request = _driveService.Files.Create(fileMetadata, stream, "image/jpeg");
          request.Fields = "id, webViewLink";
          await request.UploadAsync();
        }

        var file = request.ResponseBody;

        return Ok(new Upload(file.Id, file.WebViewLink));
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    private DriveService GetDriveService()
    {
      UserCredential credential;

      using (var stream = new FileStream("client_secret.json", FileMode.Open, FileAccess.Read))
      {
        string credPath = "token.json";
        credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
            GoogleClientSecrets.FromStream(stream).Secrets,
            new[] { DriveService.Scope.Drive },
            "user",
            CancellationToken.None,
            new FileDataStore(credPath, true)).Result;
      }

      return new DriveService(new BaseClientService.Initializer()
      {
        HttpClientInitializer = credential,
        ApplicationName = "itransition-project",
      });
    }
  }
}