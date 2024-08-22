using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using project_backend.Data;
using project_backend.Models;
using project_backend.DTOs.Collection;


namespace project_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CollectionController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Collection>> create([FromBody] CreateDto newCollection)
        {
            bool exists = await _context
            .Collections
            .AnyAsync(c => c.UserId == newCollection.UserId && c.Name.ToLower() == newCollection.Name.ToLower());

            if (exists)
            {
                return BadRequest(new { message = "You already have another collection with that name, choose a different one" });
            }

            Collection collection = new Collection
            {
                Name = newCollection.Name,
                CategoryId = newCollection.CategoryId,
                UserId = newCollection.UserId,
                Description = newCollection.Description,
                Image = newCollection.Image,
                CustomFields = newCollection.CustomFields,
            };

            // TODO: add to db

            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(create), collection);
        }

        [HttpPut]
        // [Authorize]
        public async Task<ActionResult<Collection>> update(int id, [FromBody] UpdateDto oldColl)
        {
            if(id != oldColl.Id)
            {
                return BadRequest("id mismatch");
            }

            Collection? coll = await _context.Collections.Where(c => c.Id == id).FirstOrDefaultAsync();
            if(coll == null)
            {
                return NotFound("The specified collection was not found");
            }

            coll.Name = oldColl.Name;
            coll.Description = oldColl.Description;
            coll.CategoryId = oldColl.CategoryId;
            coll.Image = oldColl.Image;
            coll.CustomFields = oldColl.CustomFields;

            _context.Collections.Update(coll);
            await _context.SaveChangesAsync();
            return Ok(coll);
        }

        // coll list by start and end
        [HttpGet]
        public async Task<ActionResult<List<Collection>>> getCollections([FromQuery] int start, [FromQuery] int limit)
        {
            var collections = await _context.Collections
                .Skip(start)
                .Take(limit)
                .ToListAsync();
            return Ok(collections);
        }

        // list of collections for the collist page
        [HttpGet("user/{id}")]
        public async Task<ActionResult<List<DTOs.Collection.ListDto>>> getCollections(int id, [FromQuery] int start, [FromQuery] int limit)
        {
            List<DTOs.Collection.ListDto> collections = await _context.Collections
            .Where(c => c.UserId == id)
            .Skip(start)
            .Take(limit)
            .Select(c => new DTOs.Collection.ListDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Category = new DTOs.Category.CategoryDto
                {
                    Id = c.CategoryId,
                    Name = c.Category!.Name
                },
                ItemCount = c.Items.Count(),
                CustomFields = c.CustomFields.OrderBy(cf => cf.Id).Take(3).Select(cf => new DTOs.CustomField.CollectionListDto
                {
                    Id = cf.Id,
                    Name = cf.Name,
                    Type = cf.Type,
                    IsRequired = cf.IsRequired,
                }
                ).ToList(),
            }
            )
            .ToListAsync();
            return Ok(collections);
        }

        // get single coll
        [HttpGet("{id}")]
        public async Task<ActionResult<Collection>> getCollection(int id)
        {
            Collection? coll = await _context.Collections.FindAsync(id);
            if(coll == null) return NotFound(new { message = "The specified collection was not found" });
            else return Ok(coll);
        }

        [HttpGet("largest/{count}")]
        public async Task<ActionResult<List<Collection>>> largest(int count)
        {
            var collections = await _context.Collections
                            .OrderByDescending(cf => cf.Items.Count)
                            .Take(count)
                            .ToListAsync();
            return Ok(collections != null ? collections : []);
        }
    }
}
