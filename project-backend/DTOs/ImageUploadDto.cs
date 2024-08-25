namespace project_backend.DTOs.Image
{
  public class Upload
  {
    public string Id { get; set; }
    public string ViewLink { get; set; }

    public Upload(string id, string viewLink)
    {
      Id = id;
      ViewLink = viewLink;
    }
  }
}
