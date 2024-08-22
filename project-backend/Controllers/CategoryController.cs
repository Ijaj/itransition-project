using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_backend.Data;
using project_backend.Models;
using Microsoft.AspNetCore.Authorization;


namespace project_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public CategoryController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public Task<List<Category>> Get(){
            return _context.Categories.ToListAsync();
        }

        [HttpGet("{id}")]
        public ActionResult<Category> GetSingle(int id){
            var cat = _context.Categories.Where(c => c.Id == id).SingleOrDefault();
            if(cat != null)
            {
                return Ok(cat);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
