import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from './users/users.repository';
import { ProjectsModule } from './projects/projects.module';
import { IssuesModule } from './issues/issues.module';
import { LabelsModule } from './labels/labels.module';
import { IssueLabelsModule } from './issue-labels/issue-labels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    IssuesModule,
    LabelsModule,
    IssueLabelsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersRepository],
})
export class AppModule {}
