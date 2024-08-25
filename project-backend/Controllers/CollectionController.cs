using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using project_backend.Data;
using project_backend.Models;
using project_backend.DTOs.Collection;
using ImageUploadApi.Controllers;

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
                Category = _context.Categories.FirstOrDefault(c => c.Id == newCollection.CategoryId)!
            };

            foreach (DTOs.CustomField.CustomFieldDto fieldDto in newCollection.CustomFields)
            {
                collection.CustomFields.Add(
                    CustomField.Create(fieldDto, collection)
                );
            }

            _context.Collections.Add(collection);
            int affected = await _context.SaveChangesAsync();
            return StatusCode(StatusCodes.Status201Created, collection.Id);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<Collection>> update(int id, [FromBody] UpdateDto oldColl)
        {
            if (id != oldColl.Id)
            {
                return BadRequest("id mismatch");
            }

            Collection? coll = await _context.Collections
                .Include(c => c.CustomFields)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (coll == null)
            {
                return NotFound("The specified collection was not found");
            }

            coll.Name = oldColl.Name;
            coll.Description = oldColl.Description;
            coll.CategoryId = oldColl.CategoryId;
            coll.Image = oldColl.Image;

            // Remove CustomFields not present in the update
            List<int> customFieldIdsToKeep = oldColl.CustomFields.Where(cf => cf.Id > 0).Select(cf => cf.Id).ToList();
            List<CustomField>? customFieldsToRemove = coll.CustomFields.Where(cf => !customFieldIdsToKeep.Contains(cf.Id)).ToList();
            foreach (var customField in customFieldsToRemove)
            {
                _context.CustomFields.Remove(customField);
            }

            // Update existing CustomFields
            foreach (var updatedField in oldColl.CustomFields.Where(cf => cf.Id > 0))
            {
                var existingField = coll.CustomFields.FirstOrDefault(cf => cf.Id == updatedField.Id);
                if (existingField != null)
                {
                    existingField.Name = updatedField.Name;
                    existingField.Type = updatedField.Type;
                    existingField.IsRequired = updatedField.IsRequired;
                }
            }

            // Add new CustomFields
            foreach (var newField in oldColl.CustomFields.Where(cf => cf.Id < 1))
            {
                coll.CustomFields.Add(CustomField.Create(newField, coll));
            }

            _context.Collections.Update(coll);
            int affected = await _context.SaveChangesAsync();
            return Ok(affected);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<int>> delete(int id)
        {
            Collection? coll = _context.Collections.FirstOrDefault(c => c.Id == id);

            if (coll == null)
            {
                return BadRequest(new { message = "No collection found" });
            }

            _context.Collections.Remove(coll);
            int affected = await _context.SaveChangesAsync();
            return affected;
        }

        // coll list by start and end
        [HttpGet]
        public async Task<ActionResult<List<Collection>>> getCollections([FromQuery] int start, [FromQuery] int limit)
        {
            var collections = await _context.Collections
                .Skip(start)
                .Take(limit)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            return Ok(collections);
        }

        // find by id - list of collections for the collist page
        [HttpGet("user/{id}")]
        public async Task<ActionResult<List<DTOs.Collection.ListDto>>> getCollections(int id, [FromQuery] int start, [FromQuery] int limit)
        {
            List<DTOs.Collection.ListDto> collections = await _context.Collections
            .Where(c => c.UserId == id)
            .Skip(start)
            .Take(limit)
            .OrderByDescending(c => c.CreatedAt)
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
                ItemCount = c.Items.ToList().Count(),
                CustomFields = c.CustomFields.Where(cf => cf.CollectionId == c.Id).ToList(),
                Image = c.Image,
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
            if (coll == null) return NotFound(new { message = "The specified collection was not found" });
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

        public async Task<ActionResult<List<Collection>>> filterCollection(int id, [FromBody] FilterDto collectionFilters)
        {
            IQueryable<Collection> query = _context.Collections.Where(c => c.Id == collectionFilters.Id)
            .Include(i => i.Items);

            query = query.Where(
                c => c.Items.Count >= collectionFilters.ItemCountMin &&
                c.Items.Count <= collectionFilters.ItemCountMax
            );

            if (collectionFilters.CategoryId > 0)
            {
                query = query.Where(c => c.CategoryId == collectionFilters.CategoryId);
            }

            if (collectionFilters.image != "both" || string.IsNullOrEmpty(collectionFilters.image))
            {
                query = collectionFilters.image == "no" ?
                query.Where(c => c.Image == null || string.IsNullOrEmpty(c.Image)) :
                query.Where(c => c.Image != null || !string.IsNullOrEmpty(c.Image));
            }

            if (collectionFilters.Sort != null || !string.IsNullOrEmpty(collectionFilters.Sort))
            {
                if (collectionFilters.Sort == "cat")
                {
                    query = query.OrderBy(c => c.CategoryId);
                }
                else if (collectionFilters.Sort == "htl")
                {
                    query = query.OrderByDescending(c => c.Items.Count);
                }
                else if (collectionFilters.Sort == "lth")
                {
                    query = query.OrderBy(c => c.Items.Count);
                }
            }

            return Ok(await query.ToListAsync());
        }
    }
}
