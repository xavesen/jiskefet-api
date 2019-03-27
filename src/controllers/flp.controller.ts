/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Controller, Get, Param, Patch, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseObject } from '../interfaces/response_object.interface';
import { FlpRole } from '../entities/flp_role.entity';
import { CreateFlpDto } from '../dtos/create.flp.dto';
import { FlpSerivce } from '../services/flp.service';
import { createResponseItem, createErrorResponse } from '../helpers/response.helper';
import { PatchFlpDto } from '../dtos/patch.flp.dto';

@ApiUseTags('flp')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('flp')
export class FlpController {

    constructor(
        private readonly flpService: FlpSerivce
    ) { }
    /**
     * Find a specific Flp. /flp/id
     * @param id unique identifier for a Flp.
     * @param name of FLP.
     */
    @Get(':name/runs/:id')
    async findById(@Param('id') runId: number, @Param('name') flpName: string): Promise<ResponseObject<FlpRole>> {
        // Aggegrate readout bytes so it can be updated for the run table,
        // aswell as the number of timeframes and subtimeframes.
        // throw new HttpException(`Endpoint is not yet implemented.`, HttpStatus.NOT_IMPLEMENTED);
        try {
            return createResponseItem(await this.flpService.findOne(flpName, runId));
        } catch (error) {
            return createErrorResponse(error);
        }
    }

    /**
     * Create flp with name and hostname
     * @param request CreateFlpDto
     */
    @Post()
    async createFlp(@Body() request: CreateFlpDto): Promise<ResponseObject<FlpRole>> {
        try {
            const flp = await this.flpService.create(request);
            return createResponseItem(flp);
        } catch (error) {
            return createErrorResponse(error);
        }
    }

    /**
     * Endpoint to update FLP values during a run
     * @param runId run number
     * @param flpName flp name
     * @param request fields to update
     */
    @Patch(':name/runs/:id')
    async updateById(
        @Param('id') runId: number,
        @Param('name') flpName: string,
        @Body() request: PatchFlpDto): Promise<ResponseObject<void>> {
        // Update bytes that are produced for the flp (during runtime).
        try {
            const flp = await this.flpService.patch(flpName, runId, request);
            return createResponseItem(flp);
        } catch (error) {
            return createErrorResponse(error);
        }
    }
}
