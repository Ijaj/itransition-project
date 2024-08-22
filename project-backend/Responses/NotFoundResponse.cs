namespace project_backend.Responses
{
    public record NotFoundResponse
    {
        public string message { get; set; }

        public NotFoundResponse(string message)
        {
            this.message = message;
        }
    }
}
