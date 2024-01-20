import { Test, TestingModule } from '@nestjs/testing';
import { StayOutService } from './stay-out.service';

describe('StayOutService', () => {
  let service: StayOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StayOutService],
    }).compile();

    service = module.get<StayOutService>(StayOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
