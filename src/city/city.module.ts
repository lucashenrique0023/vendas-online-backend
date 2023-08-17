import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from 'src/cache/cache.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity]), CacheModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
