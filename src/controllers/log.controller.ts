/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { Get, Post, Controller, Body, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LogService } from '../services/log.service';
import { CreateLogDto } from '../dtos/create.log.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryLogDto } from '../dtos/query.log.dto';
import { LinkRunToLogDto } from '../dtos/linkRunToLog.log.dto';
import { InfoLogService } from '../services/infolog.service';
import { CreateInfologDto } from '../dtos/create.infolog.dto';
import { ResponseObject } from '../interfaces/response_object.interface';
import { createResponseItem, createResponseItems, createErrorResponse } from '../helpers/response.helper';
import { Log } from '../entities/log.entity';
import { LogModule } from '../modules/log.module';

@ApiUseTags('logs')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('logs')
export class LogController {

    constructor(
        private readonly logService: LogService,
        private readonly loggerService: InfoLogService
    ) { }

    /**
     * Post a new Log item. /logs
     * @param createLogDto CreateLogDto from frontend.
     */
    @Post()
    @ApiOperation({ title: 'Creates a Log.' })
    @ApiOkResponse({ description: 'Succesfully created a Log' })
    async create(@Body() request: CreateLogDto): Promise<ResponseObject<Log>> {
        try {
            const log = await this.logService.create(request);
            return createResponseItem(log);
        } catch (error) {
            const infoLog = new CreateInfologDto();
            infoLog.message = 'Log is not properly created or saved in the database.';
            this.loggerService.logWarnInfoLog(infoLog);
            return createErrorResponse(error);
        }
    }

    /**
     * Get all logs. /logs
     */
    @Get()
    @ApiOperation({ title: 'Returns all Logs.' })
    @ApiOkResponse({ description: 'Succesfully returns Logs.' })
    async findAll(@Query() query?: QueryLogDto): Promise<ResponseObject<Log>> {
        try {
            const getLogs = await this.logService.findAll(query);
            return createResponseItems(getLogs.logs, undefined, getLogs.additionalInformation);
        } catch (error) {
            return createErrorResponse(error);
        }
    }

    /**
     * Find a specific Log item. /logs/id
     * @param id unique identifier for a Log item.
     */
    @Get(':id')
    @ApiOperation({ title: 'Returns a specific Log.' })
    @ApiOkResponse({ description: 'Succesfully returns a specific Log.' })
    async findById(@Param('id') id: number): Promise<ResponseObject<Log>> {
        try {
            const logById = await this.logService.findLogById(id);
            return createResponseItem(logById);
        } catch (error) {
            return createErrorResponse(error);
        }
    }

    /**
     * Link a run to a log.
     * @param request LinkLogToRunDto
     */
    @Patch(':id/runs')
    @ApiOperation({ title: 'Links a Run to a specific Log.' })
    @ApiOkResponse({ description: 'Succesfully linked a Run to a Log.' })
    async linkRunToLog(@Param('id') logId: number, @Body() request: LinkRunToLogDto): Promise<ResponseObject<void>> {
        try {
            const runToLog = await this.logService.linkRunToLog(logId, request);
            return createResponseItem(runToLog);
        } catch (error) {
            return createErrorResponse(error);
        }
    }
}
