using InventoryHold.Contracts;
using InventoryHold.Domain.Services;
using InventoryHold.WebApi.ApiModels;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHold.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HoldsController : ControllerBase
{
    private readonly HoldApplicationService _service;

    public HoldsController(HoldApplicationService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var holds = await _service.ListHoldsAsync(cancellationToken);
        return Ok(holds);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHoldRequestDto body, CancellationToken cancellationToken)
    {
        if (body is null)
            return BadRequest(new ApiError("validation_error", "Request body is required."));
        var (dto, err) = await _service.CreateHoldAsync(body, cancellationToken);
        if (err is not null)
            return MapError(err);
        return CreatedAtAction(nameof(GetById), new { holdId = dto!.HoldId }, dto);
    }

    [HttpGet("{holdId}")]
    public async Task<IActionResult> GetById(string holdId, CancellationToken cancellationToken)
    {
        var (dto, err) = await _service.GetHoldAsync(holdId, cancellationToken);
        if (err is not null)
            return MapError(err);
        return Ok(dto);
    }

    [HttpDelete("{holdId}")]
    public async Task<IActionResult> Release(string holdId, CancellationToken cancellationToken)
    {
        var (ok, err) = await _service.ReleaseHoldAsync(holdId, cancellationToken);
        if (!ok && err is not null)
            return MapError(err);
        return NoContent();
    }

    private IActionResult MapError(HoldServiceError err) => err.Code switch
    {
        "not_found" => NotFound(new ApiError(err.Code, err.Message)),
        "insufficient_stock" => Conflict(new ApiError(err.Code, err.Message)),
        "conflict" => Conflict(new ApiError(err.Code, err.Message)),
        _ => BadRequest(new ApiError(err.Code, err.Message))
    };
}
