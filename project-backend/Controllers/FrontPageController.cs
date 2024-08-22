using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using project_backend.Data;
using project_backend.Models;

namespace project_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FrontPage : ControllerBase
    {
        private readonly AppDbContext _context;

        public FrontPage(AppDbContext context)
        {
            _context = context;
        }
    }
}
