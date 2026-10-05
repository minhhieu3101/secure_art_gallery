import { AllExceptionsFilter } from './commons/exceptionFilter/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HandleResponseInterceptor } from './commons/interceptors/response.interceptors';
import cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new HandleResponseInterceptor());
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
      });
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Secure Art Gallery Project')
        .setDescription('The Secure Art Gallery API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();