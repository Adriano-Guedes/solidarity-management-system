using APISolidarityManager.Context;
using APISolidarityManager.Filters;
using APISolidarityManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Controllers.Items
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class ItemsController : ControllerBase
    {
        public readonly AppDbContext _context;

        public ItemsController(AppDbContext context)
        {
            _context = context;
        }

        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<ItemResponse>>> GetAllAsync()
        //{
        //    try
        //    {
        //        var items = await _context.Items
        //            .Select(i => new ItemResponse
        //            {
        //                Id = i.Id,
        //                Name = i.Name,
        //                Brand = i.Brand,
        //                Notes = i.Notes,
        //                Active = i.Active,
        //                CreatedAt = i.CreatedAt,
        //                UpdatedAt = i.UpdatedAt
        //            })
        //            .AsNoTracking()
        //            .ToListAsync();

        //        return Ok(items);
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro ao processar a solicitação.");
        //    }
        //}

        //[HttpGet("{id:guid}", Name = "GetOne")]
        //public async Task<ActionResult<ItemResponse>> GetOneAsync(Guid id)
        //{
        //    try
        //    {
        //        var item = await _context.Items
        //            .Where(i => i.Id == id)
        //            .Select(i => new ItemResponse
        //            {
        //                Id = i.Id,
        //                Name = i.Name,
        //                Brand = i.Brand,
        //                Notes = i.Notes,
        //                Active = i.Active,
        //                CreatedAt = i.CreatedAt,
        //                UpdatedAt = i.UpdatedAt
        //            })
        //            .AsNoTracking()
        //            .FirstOrDefaultAsync();

        //        if (item == null)
        //            return NotFound("Item não encontrado");

        //        return Ok(item);
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro ao processar a solicitação.");
        //    }
        //}

        //[HttpPost]
        //public async Task<ActionResult<Item>> CreateAsync(Item item)
        //{
        //    try
        //    {
        //        if (item == null)
        //            return BadRequest("Item inválido");

        //        item.Id = Guid.NewGuid();
        //        item.CreatedAt = DateTime.Now;
        //        _context.Items.Add(item);
        //        await _context.SaveChangesAsync();
        //        return CreatedAtAction(nameof(GetOneAsync), new { id = item.Id }, item);
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro ao processar a solicitação.");
        //    }
        //}

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Item>> UpdateAsync(Guid id, Item item)
        {
            try
            {
                if (id != item.Id || item == null)
                    return BadRequest("Item inválido");

                var itemToUpdate = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

                if (itemToUpdate == null)
                    return NotFound("Item não encontrado");

                itemToUpdate.Name = item.Name;
                itemToUpdate.Notes = item.Notes;
                itemToUpdate.Active = item.Active;
                itemToUpdate.UpdatedAt = DateTime.Now;

                _context.Items.Update(itemToUpdate);
                await _context.SaveChangesAsync();

                return itemToUpdate;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro ao processar a solicitação.");
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteAsync(Guid id)
        {
            try
            {
                var itemToDelete = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

                if (itemToDelete == null)
                    return NotFound("Item não encontrado");

                _context.Items.Remove(itemToDelete);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro ao processar a solicitação.");
            }
        }
    }
}
