import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AcademicsModule } from './academics/academics.module';
import { DocumentModule } from './documents/documents.module';

@Module({
  imports: [UserModule, AuthModule, AcademicsModule, DocumentModule],
})
export class ApiModule {}
