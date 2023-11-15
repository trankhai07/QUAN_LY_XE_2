import { Body, Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReasonDto } from './dto/reason.dto';

@Controller('reason')
@Controller({ path: 'reason', version: '2' })
export class ReasonController {
    // @Get('')
    // @UsePipes(new ValidationPipe())
    // getBookingdetail(@Body() data: ReasonDto) {
    //     console.log(data);
    // }
}
